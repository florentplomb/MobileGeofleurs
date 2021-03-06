// Copyright (C) 2015 Plomb Florent plombf@gmail.com

// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License along
// with this program; if not, write to the Free Software Foundation, Inc.,
// 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
var appMap = angular.module('starter.map', ['starter.services', 'starter.factory', 'leaflet-directive', 'ngCordova', 'ngDialog', 'angucomplete-alt']);


appMap.controller('MapCtrl', function($scope, $http, $ionicPlatform, ngDialog, HardwareBackButtonManager, $ionicHistory, $ionicLoading, AuthService, $ionicPopup, $state, apiUrl, $rootScope, flowersService, $cordovaGeolocation, leafletData, $ionicPopup, $log, $timeout, EspService) {

    HardwareBackButtonManager.disable();

    $rootScope.currentUser = AuthService.currentUser;
    $rootScope.markers = [];
    $scope.searchEsp = "NOMC";
    $scope.searchEspInv = "NOML";
    $scope.valideEsp = "";


    $scope.$on('$ionicView.beforeEnter', function() {


        $timeout(function() {
            $scope.$broadcast('invalidateSize');

        });
    });

    var flowerIcon = {

        iconUrl: 'img/fIcon2.png',
        iconSize: [28, 40],
        shadowSize: [50, 64],
        //iconAnchor: [22, 94],

    };

    EspService.getEspName(function(err, data) {
        if (err) {
            $scope.error = err;
            $scope.showAlert("Liste d'espèces indisponible");
        }
        $scope.espNames = data;

    });

    $scope.goDetail = function(flowerId) {
        console.log(flowerId);

        $state.go("details", {
            flowerId: flowerId
        });
    };

    $scope.showAlert = function(titleContent) {
        var alertPopup = $ionicPopup.alert({
            title: titleContent,
            template: 'Veuillez vérifier la connection'
        });

    };

    $scope.showSuccess = function(titleContent) {
        var alertPopup = $ionicPopup.alert({
            title: 'Merci pour votre participation',
            template: titleContent
        });

    };

    $scope.showConfirm = function() {

        ngDialog.open({
            template: 'templates/popup/noGeo.html',
            closeByDocument: false,
            closeByEscape: false,
            showClose: false,
            className: 'ngdialog-theme-default custom-width',
            scope: $scope
        });

    };


    $scope.displayFlowers = function() {


        $ionicLoading.show({
            template: "Chargement des publications...",
            delay: 750

        });

        $scope.markers = [];

        flowersService.getflowers(function(err, flowers) {
            if (err) {

                $ionicLoading.hide();
                $scope.showAlert("Publication indisponible");
                $scope.error = err;

            } else {

                angular.forEach(flowers, function(flower) {


                    $scope.urlImgID = apiUrl + "/images/";

                    $scope.markers.push({
                        lng: parseFloat(flower.geometry.coordinates[0]),
                        lat: parseFloat(flower.geometry.coordinates[1]),
                        id: flower._id,
                        icon: flowerIcon,
                        group: 'yverdon',
                        message: '<div ng-click="goDetail(flower._id)"><img style="float: left;" src="img/flower8.png" width="20px"/> <p>{{flower.properties.espece.NOMC}} <p style="font-style:italic; line-height: 24px;" ng-hide="flower.properties.espece.NOMC"> Indéfinie </p>  </p><img align="center" ng-src="{{urlImgID+flower.properties.image}}" style="margin-top: -12px;" width="90px"/><a style="display:block; text-align:center;" id="popuplf class="button icon-right ion-android-arrow-dropright">Details</a></div>',

                        getMessageScope: function() {
                            var scope = $scope.$new();
                            scope.flower = flower;
                            return scope;
                        }

                    });

                })
                $ionicLoading.hide()
            }

        });
    };

    $scope.displayFlowers();

    $scope.center = {
        lat: 46.841759385352,
        lng: 6.64475440979004,
        zoom: 10
    };

    $scope.maxbounds = {
        southWest: {
            lat: 42.749859206774524,
            lng: 2.559438705444336
        },
        northEast: {
            lat: 48.8027621127906,
            lng: 10.731100082397461
        }

    };
    $scope.geolocLoad = true;
    $scope.geolocOn = false;
    $scope.geolocOff = false;

    leafletData.getMap().then(function(map) {
        if (map._controlCorners.bottomleft.childElementCount === 0) {

            var lc = L.control.locate({
                position: 'topleft',

                setView: true,
                keepCurrentZoomLevel: false,
                locateOptions: {
                    enableHighAccuracy: true,
                    maximumAge: 3000,
                    timeout: 10000
                }
            }).addTo(map);
            lc.start();


        }

        $scope.stopGeo = function() {
            $scope.geolocOn = false;
            $scope.geolocOff = true;
            $scope.geolocLoad = false;
            lc.stop();
        }
        $scope.startGeo = function() {

            $scope.geolocLoad = true;
            $scope.geolocOn = false;
            $scope.geolocOff = false;
            lc.start();

        }

        map.on('startfollowing', function() {
            $scope.geolocOn = true;

        }).on('stopfollowing', function() {
            $scope.geolocOn = false;


        });

        map.on('locationfound', function(e) {

            $scope.position = e.latlng
            $scope.geolocOn = true;
            $scope.geolocLoad = false;
            $scope.geolocOff = false;

        });

        map.on('locationerror', function(e) {
            $scope.geolocLoad = true;
            $scope.geolocOn = false;
            $scope.geolocOff = false;
            lc.stop();
            $scope.showConfirm();
        });

    })


    $scope.layers = {
        baselayers: {
            osm: {
                name: 'OpenStreetMap',
                url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                type: 'xyz'
            },
            mapbox_frontier: {
                name: 'Frontières communales',
                url: "http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}",
                type: 'xyz',
                layerOptions: {
                    apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
                    mapid: 'fplomb.685fc191'
                }
            },
            googleSatellite: {
                name: 'Google Satellite',
                layerType: 'SATELLITE',
                type: 'google'
            },
            googleRoadmap: {
                name: 'Google Streets',
                layerType: 'ROADMAP',
                type: 'google'
            }
        }
    }



})