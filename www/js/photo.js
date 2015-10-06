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
var appPhoto = angular.module('starter.photo', ['starter.services', 'starter.factory', 'ngCordova', 'ngDialog']);

appPhoto.controller('PhotoCtrl', function($scope, ngDialog, $timeout, AuthService, flowersService, $rootScope, $state, $ionicPopup, CameraService, apiUrl, $http, $ionicLoading) {

    var lng;
    var lat;

    $timeout(function() {
        $scope.$watch(function() {
            return $scope.selectEsp;
        }, function() {


            $rootScope.selEsp = $scope.selectEsp;
            console.log($rootScope.selEsp);

        })
    });

    $scope.$watch(function() {
        return $scope.newCommune;
    }, function() {


        $rootScope.commune = $scope.newCommune;
        console.log($rootScope.commune);

    })

    $scope.ifKnowName = function(positionPhoto) {

        ngDialog.open({
            template: 'templates/popup/knowEsp.html',
            closeByDocument: false,
            closeByEscape: false,
            showClose: false,
            className: 'ngdialog-theme-default margePop',
            scope: $scope
        });

    }

    $scope.yesIknowEsp = function() {


        ngDialog.open({
            scope: $scope,
            template: 'templates/popup/yesIKnowEsp.html',
            templateId: 'alller',
            closeByDocument: false,
            closeByEscape: false,
            showClose: false,
            className: 'ngdialog-theme-default largePop',

        });

    }

    $scope.noIDontknowEsp = function() {
        ngDialog.open({
            template: 'templates/popup/dontKnowEsp.html',
            closeByDocument: false,
            closeByEscape: false,
            showClose: false,
            className: 'ngdialog-theme-default custom-width',
            scope: $scope
        });
    }

    $scope.publish = function(e) {

        $scope.newFlower = {
            type: "Feature",
            properties: {

                commune: {},
                image: {},
                espece: null,
            },
            geometry: {
                type: "Point",
                coordinates: []
            }
        };


        if ($rootScope.selEsp != null) {
            $scope.newFlower.properties.espece = $rootScope.selEsp.originalObject.ISFS;
        } else {
            $scope.newFlower.properties.espece = null;
        }

        $scope.newFlower.properties.commune = $scope.newCommune[0]._id;
        $scope.newFlower.properties.image = $scope.newImgId;
        $scope.newFlower.geometry.coordinates = [];
        $scope.newFlower.geometry.coordinates.push(lng);
        $scope.newFlower.geometry.coordinates.push(lat);


        console.log($scope.newFlower);


        $ionicLoading.show({
            template: "Publication...",
            delay: 750
        });

        flowersService.postflower(function(err, data) {
            if (err || !data) {
                $scope.showAlert("Publication interompue. Veuillez réessayer");
                $ionicLoading.hide();
                // $scope.resetflower();


            } else {

                $ionicLoading.hide();
                // $scope.resetflower();
                $scope.displayFlowers();
                $scope.showSuccess("Votre saisie est maintenant disponible sur la carte");
            };
        }, $scope.newFlower)

    };

    $scope.getPhoto = function() {

        $scope.newZone = {
            type: "Feature",
            properties: {},
            geometry: {
                type: "Point",
                coordinates: []
            }
        }

        lng = $scope.position.lng
        lat = $scope.position.lat

        $scope.newZone.geometry.coordinates.push(lng);
        $scope.newZone.geometry.coordinates.push(lat);


        $rootScope.selEsp = null;

        $http({
            method: "POST",
            url: apiUrl + "/communes/geoloc",
            params: {
                access_token: AuthService.currentUser.token
            },
            headers: {
                "Content-type": "application/json"
            },
            data: {
                "zone": $scope.newZone
            }
        }).success(function(data) {
            $scope.newCommune = data;
            commune = data;

        }).error(function(err) {
            $scope.showAlert("Commune introuvable");
            $scope.newCommune[0]._id = null;
            $ionicLoading.hide();

        })

        CameraService.getPicture({
            quality: 75,
            targetWidth: 800,
            targetHeight: 1200,
            saveToPhotoAlbum: false,
            correctOrientation: true,
            encodingType: navigator.camera.EncodingType.JPEG,
            destinationType: navigator.camera.DestinationType.DATA_URL,
            allowEdit: true,
        }).then(function(imageData) {

            $ionicLoading.show({
                template: "Chargement de l'image...",
                delay: 750
            });

            $http({
                method: "POST",
                url: apiUrl + "/images",
                params: {
                    access_token: AuthService.currentUser.token
                },
                headers: {
                    "Content-type": "application/json"
                },
                data: {
                    "imageB64": imageData
                }
            }).success(function(idImg) {

                $ionicLoading.hide();
                $rootScope.UrlnewImg = apiUrl + "/images/" + idImg;
                $scope.newImgId = idImg;
                $scope.ifKnowName();

            }).error(function(err) {
                // $scope.resetflower();
                $ionicLoading.hide();
                $scope.showAlert("Chargement de l'image interrompu. Veuillez réessayer");
            });

        }, function(err) {

        });

    }

})