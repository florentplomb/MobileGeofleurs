var appPhoto = angular.module('starter.photo', ['starter.services','starter.factory','ngCordova', 'ngDialog']);

appPhoto.controller('PhotoCtrl', function($scope,ngDialog, $timeout, AuthService, flowersService, $rootScope, $state, $ionicPopup, CameraService, apiUrl, $http, $ionicLoading) {

    $timeout(function() {
        $scope.$watch(function() {
            return $scope.selectEsp;
        }, function() {

            $rootScope.selEsp = $scope.selectEsp;

        })
    });

    $scope.resetflower = function() {
        console.log("ResetFlower");
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

  $scope.noIDontknowEsp = function(){
     $scope.resetflower();
  }

    $scope.ifKnowName = function(positionPhoto) {

  ngDialog.open({
            template: 'templates/popup/knowEsp.html',
            closeByDocument: false,
            closeByEscape: false,
            showClose: false,
            className : 'ngdialog-theme-default margePop',
            scope: $scope
        });



        // var myPopup = $ionicPopup.show({
        //     templateUrl: "templates/ifName.html",
        //     title: "Connaissez-vous le nom de l'espèce observée ?",
        //     scope: $scope,
        //     buttons: [{
        //         text: 'Non',
        //         onTap: function(e) {

        //             var myPopupSecond = $ionicPopup.show({
        //                 template: " <div> Votre saisie sera disponible sur la carte , vous ou d'autres personnes pourrons à tout moment ajouter les informations manquantes à votre saisie </div>",
        //                 title: "Vous ne connaissez pas cette espèce?",
        //                 subTitle: "Ce n'est pas grave...",
        //                 scope: $scope,
        //                 buttons: [{
        //                     text: 'Annuler  ',
        //                     onTap: function() {
        //                         $scope.resetflower();
        //                     }
        //                 }, {
        //                     text: '<b>Publier</b>',
        //                     type: 'button-positive',
        //                     onTap: function(e) {

        //                         $scope.invEsp = false;
        //                         $scope.newFlower.properties.commune = $scope.newCommune[0]._id;
        //                         $scope.newFlower.properties.image = $scope.newImgId;

        //                         $ionicLoading.show({
        //                             template: "Publication...",
        //                             delay: 750
        //                         });

        //                         $http({
        //                             method: "POST",
        //                             url: apiUrl + "/fleurs",
        //                             params: {
        //                                 access_token: AuthService.currentUser.token
        //                             },
        //                             headers: {
        //                                 "Content-type": "application/json"
        //                             },
        //                             data: {
        //                                 "flower": $scope.newFlower
        //                             }
        //                         }).success(function(data) {

        //                             $ionicLoading.hide();
        //                             $scope.resetflower();
        //                             $scope.displayFlowers();

        //                         }).error(function(err) {
        //                             $scope.showAlert("Problème de publication");
        //                             $ionicLoading.hide();
        //                             $scope.resetflower();
        //                         });
        //                     }
        //                 }]
        //             });
        //         }
        //     }, {
        //         text: '<b>Oui</b>',
        //         type: 'button-positive',
        //         onTap: function(e) {

        //             $scope.showSelectName();

        //         }
        //     }]
        // });

    }

    $scope.yesIknowEsp = function() {


        ngDialog.open({
            template: 'templates/popup/yesIKnowEsp.html',
            templateId : 'alller',
            closeByDocument: false,
            closeByEscape: false,
            showClose: false,
            className: 'ngdialog-theme-default largePop',
            scope: $scope
        });

        // An elaborate, custom popup
        // var myPopup = $ionicPopup.show({
        //     templateUrl: "templates/getNameFlower.html",
        //     title: "Nom de l'espèce observée ",
        //     scope: $scope,
        //     cssClass: "popNameSelect",
        //     buttons: [{
        //         text: 'Annuler',
        //         onTap: function(e) {
        //             $scope.resetflower();
        //         }
        //     }, {
        //         text: '<b>Publier</b>',
        //         type: 'button-positive',
        //         onTap: function(e) {

        //             if (!$rootScope.selEsp) {
        //                 $scope.invEsp = true;
        //                 e.preventDefault();
        //             } else {
        //                 $scope.invEsp = false;
        //                 $scope.newFlower.properties.commune = $scope.newCommune[0]._id;
        //                 $scope.newFlower.properties.espece = $rootScope.selEsp.originalObject.ISFS;
        //                 $scope.newFlower.properties.image = $scope.newImgId;
        //                 $ionicLoading.show({
        //                     template: "Publication",
        //                     delay: 750
        //                 });

        //                 $http({
        //                     method: "POST",
        //                     url: apiUrl + "/fleurs",
        //                     params: {
        //                         access_token: AuthService.currentUser.token
        //                     },
        //                     headers: {
        //                         "Content-type": "application/json"
        //                     },
        //                     data: {
        //                         "flower": $scope.newFlower
        //                     }
        //                 }).success(function(data) {
        //                     $ionicLoading.hide();
        //                     $scope.resetflower();
        //                     $scope.displayFlowers();
        //                     console.log(data);
        //                 }).error(function(err) {
        //                     $scope.resetflower();
        //                     $ionicLoading.hide();
        //                     $scope.showAlert("Publication indisponible");

        //                 });

        //             }

        //         }
        //     }]


        // });

    }


        $scope.getPhoto = function() {

            var lng = $scope.position.lng;
            var lat =  $scope.position.lat;

            $scope.newFlower.geometry.coordinates.push(lng);
            $scope.newFlower.geometry.coordinates.push(lat);


            // CameraService.getPicture({
            //     quality: 100,
            //     targetWidth: 400,
            //     targetHeight: 600,
            //     saveToPhotoAlbum: false,
            //     correctOrientation: true,
            //     encodingType: navigator.camera.EncodingType.JPEG,
            //     destinationType: navigator.camera.DestinationType.DATA_URL
            // }).then(function(imageData) {


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
                    "imageB64": "lll" //imageData
                }
            }).success(function(idImg) {


                $ionicLoading.hide();

                $rootScope.UrlnewImg = apiUrl + "/images/" + idImg;
                $scope.newImgId = idImg;
                $scope.ifKnowName();

            }).error(function(err) {

                $scope.showAlert("L'image ne peux pas être chargée");
                $scope.resetflower();
            });

            // }, function(err) {
            //     alert("erorr" + err);

            //     $scope.error = err;

            // });


            $http({
                method: "POST",
                url: apiUrl + "/communes/geoloc",
    params :{
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
                console.log($scope.newCommune);

            }).error(function(err) {
                $scope.resetflower();
                $scope.newCommune = {};
                $scope.showAlert("La liste des communes ne peux pas être chargée");

            })

        }




    // $scope.getPhoto = function() {

    //     var lng = $scope.position.lng
    //     var lat = $scope.position.lat

    //     $scope.newFlower.geometry.coordinates = [];
    //     $scope.newFlower.geometry.coordinates.push(lng);
    //     $scope.newFlower.geometry.coordinates.push(lat);


    //     CameraService.getPicture({
    //         quality: 75,
    //         targetWidth: 400,
    //         targetHeight: 600,
    //         saveToPhotoAlbum: false,
    //         correctOrientation: true,
    //         encodingType: navigator.camera.EncodingType.JPEG,
    //         destinationType: navigator.camera.DestinationType.DATA_URL
    //     }).then(function(imageData) {


    //         $ionicLoading.show({
    //             template: "Chargement de l'image...",
    //             delay: 750
    //         });

    //         $http({
    //             method: "POST",
    //             url: apiUrl + "/images",
    //             params: {
    //                 access_token: AuthService.currentUser.token
    //             },
    //             headers: {
    //                 "Content-type": "application/json"
    //             },
    //             data: {
    //                 "imageB64": imageData
    //             }
    //         }).success(function(idImg) {


    //             $ionicLoading.hide();

    //             $rootScope.UrlnewImg = apiUrl + "/images/" + idImg;
    //             $scope.newImgId = idImg;
    //             $scope.ifKnowName();

    //         }).error(function(err) {
    //             $scope.resetflower();
    //             $ionicLoading.hide();
    //             alert("Impossible de charger l'image");
    //         });

    //     }, function(err) {
    //         alert("erorr" + err);
    //         $scope.resetflower();
    //         $scope.error = err;
    //     });


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
    //         $scope.newCommune = {};
    //         $ionicLoading.hide();

    //     })

    // }

})


