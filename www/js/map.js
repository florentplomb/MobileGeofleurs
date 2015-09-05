var appMap = angular.module('starter.map', ['starter.services', 'starter.factory', 'leaflet-directive', 'ngCordova', 'ngDialog', 'angucomplete-alt']);


appMap.controller('MapCtrl', function($scope, $http, $ionicPlatform, ngDialog, HardwareBackButtonManager, $ionicHistory, $ionicLoading, AuthService, $ionicPopup, $state, apiUrl, $rootScope, flowersService, $cordovaGeolocation, leafletData, $ionicPopup, $log, $timeout, EspService) {

    HardwareBackButtonManager.disable();

    $rootScope.currentUser = AuthService.currentUser;
    $rootScope.markers = [];
    $scope.searchEsp = "NOMC";
    $scope.searchEspInv = "NOML";
    $scope.valideEsp = "";


    var f2 = {

        iconUrl: 'img/pink.png',
        iconSize: [28, 40],
        shadowSize: [50, 64],
        //iconAnchor: [22, 94],

    };

    var f3 = {

        iconUrl: 'img/fgreen.png',
        iconSize: [28, 40],
        shadowSize: [50, 64],
        //iconAnchor: [22, 94],

    };
    var f1 = {

        iconUrl: 'img/fIcon2.png',
        iconSize: [28, 40],
        shadowSize: [50, 64],
        //iconAnchor: [22, 94],

    };

    var flowers = [f1,f2,f3 ]

    EspService.getEspName(function(err, data) {
        if (err) {
            $scope.error = err;
            $scope.showAlert("Liste d'espèces indisponible");
        }
        $scope.espNames = data;

    });

    $scope.goDetail = function(flowerId) {
        console.log("sad");

        $state.go("details", {
            flowerId: flowerId
        })
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

           $scope.markers = [];

                function random(low, high) {
            return Math.random() * (high - low) + low;
        }

        function randomInt(low, high) {
            return Math.floor(Math.random() * (high - low) + low);
        }

        var minLat = 45.8256705653105;
        var maxLat = 46.8669985529976;
        var minLng = 6.29591674804687;
        var maxLng = 6.78003082275391;


        for (var i = 0; i < 300; i++) {

            $scope.markers.push({
                lng: random(minLng, maxLng),
                lat: random(minLat, maxLat),
                icon:flowers[randomInt(0, flowers.length)],
                message: '<p ng-click="goDetail()"><img src="img/flower8.png" width="20px"/>Coquelicot</p><img src="img/fleur8.jpg" style="padding-left: 12px; margin-top: -12px; margin-left: 12px" width="100px"/><a style="display:block; text-align:center" id="popuplf class="button icon-right ion-android-arrow-dropright">Details</a>',
                group: 'yverdon',
                draggable: true,
                 getMessageScope: function() {
                            var scope = $scope.$new();

                            return scope;
                        }


            });
        }



        for (var i = 0; i < 200; i++) {

            $scope.markers.push({
                lng: random(minLng, maxLng),
                lat: random(minLat, maxLat),
                icon:flowers[randomInt(0, flowers.length)],
                message: '<p ng-click="goDetail()"><img src="img/flower8.png" width="20px"/>Orchidée moucheron</p><img src="img/fleur8.jpg" style="padding-left: 12px; margin-top: -12px; margin-left: 12px" width="100px"/><a style="display:block; text-align:center" id="popuplf class="button icon-right ion-android-arrow-dropright">Details</a>',
                group: 'yverdon',
                draggable: true,
                 getMessageScope: function() {
                            var scope = $scope.$new();

                            return scope;
                        }


            });
        }





        $ionicLoading.show({
            template: "Chargement des publications",
            delay: 750

        });



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
                        // icon: flowerIcon,
                        group: 'yverdon',
                        message: '<div ng-click="goDetail()"><p>{{}}</p><img src="{{urlImgID+flower.properties.image}}" width="100px" /><a style="display:block;" id="popuplf class="button icon-right ion-android-arrow-dropright">Details</a></div>',
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
            lat: 43.749859206774524,
            lng: 5.559438705444336
        },
        northEast: {
            lat: 48.8027621127906,
            lng: 7.731100082397461
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
        mapbox_light: {
          name: 'Frontières communales',
          url: mapboxTileLayer,
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
        },
      }
    }


    var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + "fplomb.685fc191";
    mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + "pk.eyJ1IjoiZnBsb21iIiwiYSI6ImJwRUF2ZlkifQ.OIuXY-qgnEBzcnYwXg8imw";
    $scope.defaults = {
        tileLayer: mapboxTileLayer
    };

})