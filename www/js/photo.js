var appPhoto = angular.module('starter.photo', ['starter.services', 'starter.factory', 'ngCordova', 'ngDialog']);

appPhoto.controller('PhotoCtrl', function($scope, ngDialog, $timeout, AuthService, flowersService, $rootScope, $state, $ionicPopup, CameraService, apiUrl, $http, $ionicLoading) {



    $timeout(function() {
        $scope.$watch(function() {
            return $scope.selectEsp;
        }, function() {


            $rootScope.selEsp = $scope.selectEsp;
            console.log($rootScope.selEsp);

        })
    });

    $scope.resetflower = function() {

        console.log("ResetFlower");

        $scope.newCommune = [];

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

    }

    $scope.resetflower();

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
            template: 'templates/popup/yesIKnowEsp.html',
            templateId: 'alller',
            closeByDocument: false,
            closeByEscape: false,
            showClose: false,
            className: 'ngdialog-theme-default largePop',
            scope: $scope
        });

    }


    $scope.publish = function(e) {



        if ($rootScope.selEsp) {
            $scope.newFlower.properties.espece = $rootScope.selEsp.originalObject.ISFS;
        } else {
            $scope.newFlower.properties.espece = null;
        }

        $scope.newFlower.properties.commune = $scope.newCommune[0]._id;
        $scope.newFlower.properties.image = $scope.newImgId;

        $ionicLoading.show({
            template: "Publication...",
            delay: 750
        });

        flowersService.postflower(function(err, data) {
            if (err || !data) {
                $scope.showAlert("Publication interompue. Veuillez réessayer");
                $ionicLoading.hide();
                $scope.resetflower();


            } else {

                $ionicLoading.hide();
                $scope.resetflower();
                $scope.displayFlowers();
                $scope.showSuccess("Votre saisie est maintenan dispnobile sur la carte");
            };
        }, $scope.newFlower)



    };


    // $scope.getPhoto = function() {

    //     var lng = $scope.position.lng;
    //     var lat = $scope.position.lat;

    //     $scope.newFlower.geometry.coordinates.push(lng);
    //     $scope.newFlower.geometry.coordinates.push(lat);


    //     // CameraService.getPicture({
    //     //     quality: 100,
    //     //     targetWidth: 400,
    //     //     targetHeight: 600,
    //     //     saveToPhotoAlbum: false,
    //     //     correctOrientation: true,
    //     //     encodingType: navigator.camera.EncodingType.JPEG,
    //     //     destinationType: navigator.camera.DestinationType.DATA_URL
    //     // }).then(function(imageData) {


    //     $ionicLoading.show({
    //         template: "Chargement de l'image...",
    //         delay: 750
    //     });

    //     $http({
    //         method: "POST",
    //         url: apiUrl + "/images",
    //         params: {
    //             access_token: AuthService.currentUser.token
    //         },
    //         headers: {
    //             "Content-type": "application/json"
    //         },
    //         data: {
    //             "imageB64": "lll" //imageData
    //         }
    //     }).success(function(idImg) {


    //         $ionicLoading.hide();

    //         $rootScope.UrlnewImg = apiUrl + "/images/" + idImg;
    //         $scope.newImgId = idImg;
    //         $scope.ifKnowName();

    //     }).error(function(err) {
    //         $ionicLoading.hide();
    //         $scope.showAlert("L'image ne peux pas être chargée");
    //         $scope.resetflower();
    //     });

    //     // }, function(err) {
    //     //     alert("erorr" + err);

    //     //     $scope.error = err;

    //     // });


    //     $http({
    //         method: "POST",
    //         url: apiUrl + "/communes/geoloc",
    //         params: {
    //             access_token: AuthService.currentUser.token
    //         },
    //         headers: {
    //             "Content-type": "application/json"
    //         },
    //         data: {
    //             "zone": $scope.newFlower
    //         }
    //     }).success(function(data) {
    //         $scope.newCommune = data;
    //         console.log($scope.newCommune);

    //     }).error(function(err) {
    //         $scope.resetflower();
    //         $scope.newCommune = {};
    //         $scope.showAlert("La liste des communes ne peux pas être chargée");

    //     })

    // }



    $scope.getPhoto = function() {

      var lng = $scope.position.lng
            var lat = $scope.position.lat

            $scope.newFlower.geometry.coordinates = [];
            $scope.newFlower.geometry.coordinates.push(lng);
            $scope.newFlower.geometry.coordinates.push(lat);


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
                "zone": $scope.newFlower
            }
        }).success(function(data) {
            $scope.newCommune = data;


        }).error(function(err) {
        $scope.showAlert("commune introuvable");
        $scope.newCommune[0]._id = null;
            $ionicLoading.hide();

        })

        CameraService.getPicture({
            quality: 75,
            targetWidth: 400,
            targetHeight: 600,
            saveToPhotoAlbum: false,
            correctOrientation: true,
            encodingType: navigator.camera.EncodingType.JPEG,
            destinationType: navigator.camera.DestinationType.DATA_URL
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
                $scope.resetflower();
                $ionicLoading.hide();
                $scope.showAlert("Chargement de l'image interrompu. Veuillez réessayer");
            });

        }, function(err) {
            $scope.resetflower();
        });



    }

})