var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
    return window._; // assumes underscore has already been loaded on the page
});

angular.module('starter.controllers', ['starter.services', 'ionic', 'leaflet-directive', 'ngCordova', 'angucomplete-alt'])

//.constant('apiUrl', 'http://localhost:8100/api-proxy')
.constant('apiUrl', 'http://localhost:8100/local-proxy')

//.constant('apiUrl', 'http://geofleurs.herokuapp.com/api')



.controller('MapCtrl', function($scope, $ionicLoading, $state, apiUrl, $rootScope, flowersService, $cordovaGeolocation, leafletData, $ionicPopup, $log, $timeout, EspService) {

    $rootScope.markers = [];
    $scope.searchEsp = "NOMC";
    $scope.searchEspInv = "NOML";
    $scope.valideEsp = "";


    EspService.getEspName(function(err, data) {
        if (err) $scope.error = err;
        $scope.espNames = data;

    });


    $scope.goDetail = function(flowerId) {
        console.log(flowerId);

        $state.go("tab.flowerDetails", {
            flowerId: flowerId
        });
    };

    $scope.displayFlowers = function() {


        $ionicLoading.show({
            template: "Chargement des publications",
            delay: 750
        });


        flowersService.getflowers(function(err, flowers) {
            if (err) {
                $ionicLoading.hide();
                $scope.error = err;
            }

            angular.forEach(flowers, function(flower) {
                $scope.urlImgID = apiUrl + "/images/" + flower.properties.image;
                $scope.markers.push({

                    lng: parseFloat(flower.geometry.coordinates[0]),
                    lat: parseFloat(flower.geometry.coordinates[1]),
                    id: flower._id,
                    //  message : "hello",
                    message: '<div ng-click="goDetail(flower._id)"><p>{{}}</p><img src="{{urlImgID}}" width="100px" /><a style="display:block;" id="popuplf class="button icon-right ion-android-arrow-dropright">Details</a></div>',
                    getMessageScope: function() {
                        var scope = $scope.$new();
                        scope.flower = flower;
                        return scope;
                    }

                });

            })
            $ionicLoading.hide();
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

    $scope.geoloc1 = true;
    $scope.geoloc2 = false;
    $scope.geoloc3 = false;

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
            console.log("geoloc");

        }

        $scope.stopgeo = function() {
            $scope.geoloc2 = false;
            $scope.geoloc3 = true;
            lc.stop();
        }
        $scope.startgeo = function() {

            $scope.geoloc2 = true;
            $scope.geoloc3 = false;
            lc.start();

        }

        map.on('startfollowing', function() {
            $scope.geolocOn = true;

        }).on('stopfollowing', function() {
            $scope.geolocOn = false;


        });

        map.on('locationfound', function(e) {

            $scope.position = e.latlng
            $scope.geoloc2 = true;
            $scope.geoloc1 = false;
            $scope.geoloc3 = false;

        });

        map.on('locationerror', function(e) {
            $scope.geoloc1 = true;
            $scope.geoloc2 = false;
            $scope.geoloc3 = false;

            if (!alert("Géolocalisation impossible: Activer le GPS , préférer les endroits dégagés")) {
                window.location.reload();
            }



        })

    });

    function pop() {
        var alertPopup = $ionicPopup.alert({
            title: 'Impossible to get position active your geoloc or try later'

        });
        alertPopup.then(function(res) {

        });
    };

    var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + "cleliapanchaud.kajpf86n";
    mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + "pk.eyJ1IjoiY2xlbGlhcGFuY2hhdWQiLCJhIjoiM2hMOEVXYyJ9.olp7FrLzmzSadE07IY8OMQ";
    $scope.defaults = {
        tileLayer: mapboxTileLayer
    };



})

.controller('DetailCtrl', function($scope, apiUrl, $stateParams, flowersService, $state) {


    var flowerId = $stateParams.flowerId;

    $scope.urlImg = apiUrl + "/images/"
    flowersService.getByIdflower(function(err, flower) {
        if (err) $scope.error = err;

        $scope.flower = flower;

    }, flowerId);


})

.controller('PhotoCtrl', function($scope, $timeout, flowersService, $rootScope, $state, $ionicPopup, CameraService, apiUrl, $http, $ionicLoading) {

    $timeout(function() {
        $scope.$watch(function() {
            return $scope.selectEsp;
        }, function() {

            $rootScope.selEsp = $scope.selectEsp;

        })
    });

    $scope.resetflower = function() {
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

    $scope.ifKnowName = function(positionPhoto) {

        var myPopup = $ionicPopup.show({
            templateUrl: "templates/ifName.html",
            title: "Connaissez-vous le nom de l'espèce observée ?",
            scope: $scope,
            buttons: [{
                text: 'Non',
                onTap: function(e) {


                    var myPopupSecond = $ionicPopup.show({
                        template: " <div> Votre saisie sera disponible sur la carte , vous ou d'autres personnes pourrons à tout moment ajouter les informations manquantes à votre saisie </div>",
                        title: "Vous ne connaissez pas cette espèce?",
                        subTitle: "Ce n'est pas grave...",
                        scope: $scope,
                        buttons: [{
                            text: 'Annuler',
                            onTap:function(){
                                $scope.resetflower();
                            }
                        }, {
                            text: '<b>Publier</b>',
                            type: 'button-positive',
                            onTap: function(e) {

                                $scope.invEsp = false;
                                $scope.newFlower.properties.commune = $scope.newCommune[0]._id;
                                $scope.newFlower.properties.image = $scope.newImgId;

                                $ionicLoading.show({
                                    template: "Publication...",
                                    delay: 750
                                });

                                $http({
                                    method: "POST",
                                    url: apiUrl + "/fleurs",
                                    headers: {
                                        "Content-type": "application/json"
                                    },
                                    data: {
                                        "flower": $scope.newFlower
                                    }
                                }).success(function(data) {

                                    $ionicLoading.hide();
                                    $scope.resetflower();
                                    $scope.displayFlowers();

                                }).error(function(err) {
                                    $ionicLoading.hide();
                                });
                            }
                        }]
                    });
                }
            }, {
                text: '<b>Oui</b>',
                type: 'button-positive',
                onTap: function(e) {

                    $scope.showSelectName();

                }
            }]
        });

    }

    $scope.showSelectName = function() {


        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            templateUrl: "templates/getNameFlower.html",
            title: "Nom de l'espèce observée ",
            scope: $scope,
            cssClass: "popNameSelect",
            buttons: [{
                text: 'Annuler',
                onTap:function(e){
                    $scope.resetflower();
                }
            }, {
                text: '<b>Publier</b>',
                type: 'button-positive',
                onTap: function(e) {

                    if (!$rootScope.selEsp) {
                        $scope.invEsp = true;
                        e.preventDefault();
                    } else {
                        $scope.invEsp = false;
                        $scope.newFlower.properties.commune = $scope.newCommune[0]._id;
                        $scope.newFlower.properties.espece = $rootScope.selEsp.originalObject.ISFS;
                        $scope.newFlower.properties.image = $scope.newImgId;
                        $ionicLoading.show({
                            template: "Publication",
                            delay: 750
                        });


                        $http({
                            method: "POST",
                            url: apiUrl + "/fleurs",
                            headers: {
                                "Content-type": "application/json"
                            },
                            data: {
                                "flower": $scope.newFlower
                            }
                        }).success(function(data) {

                            $ionicLoading.hide();
                            $scope.resetflower();
                            $scope.displayFlowers();

                            console.log(data);


                        }).error(function(err) {
                            $ionicLoading.hide();
                            alert("Erreur de publication");

                        });



                    }


                }
            }]


        });

    }



    $scope.getPhoto = function() {

        var lng = $scope.position.lng
        var lat = $scope.position.lat

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
            headers: {
                "Content-type": "application/json"
            },
            data: {
                "imageB64": "lll" //imageData
            }
        }).success(function(idImg) {


            $ionicLoading.hide();

            $scope.UrlnewImg = apiUrl + "/images/" + idImg;
            $scope.newImgId = idImg;
            $scope.ifKnowName();

        }).error(function(err) {

            alert("Impossible de charger l'image");
        });

        // }, function(err) {
        //     alert("erorr" + err);

        //     $scope.error = err;
        // });


        $http({
            method: "POST",
            url: apiUrl + "/communes/geoloc",
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
            $scope.newCommune = {};
            alert("Commune introuvable");

        })

    }

})



.factory('CameraService', ['$q', function($q) {

    return {
        getPicture: function(options) {


            var q = $q.defer();
            navigator.camera.getPicture(function(result) {
                // Do any magic you need
                q.resolve(result);
            }, function(err) {
                q.reject(err);
            }, options);

            return q.promise;
        }
    };

}])

.factory("EspService", function($http, apiUrl) {


    var config = {
        headers: {
            "Content-type": "application/json"
        }
    };
    return {
        getEspName: function(callback) {
            $http.get("data/listeEsp.json", config).success(function(data) {
                callback(null, data);
            }).error(function(error) {
                callback(error);
            });
        }
    };

})


.factory("flowersService", function($http, apiUrl) {


    var config = {
        headers: {
            "Content-type": "application/json"
        }
    };
    return {
        getflowers: function(callback) {
            $http.get(apiUrl + "/fleurs", config).success(function(data) {
                callback(null, data);
            }).error(function(error) {
                callback(error);
            });
        },
        getByIdflower: function(callback, flowerId) {
            $http.get(apiUrl + "/fleurs/" + flowerId, config).success(function(data) {
                callback(null, data);
            }).error(function(error) {
                callback(error);
            });
        }
    };

})


.controller('RegisterCtrl', function($scope, AuthService, $ionicHistory, $rootScope, $ionicPopup, $state, apiUrl, $ionicLoading, $http) {

    $scope.$on('$ionicView.beforeEnter', function() {
        // Initialize (or re-initialize) the user object.
        // The first name and last name will be automatically filled from the form thanks to AngularJS's two-way binding.
        $scope.user = {};
    });
    $scope.register = function() {

        // Forget the previous error (if any).
        delete $scope.error;

        // Show a loading message if the request takes too long.
        $ionicLoading.show({
            template: 'Regsiter in...',
            delay: 750
        });


        // Make the request to retrieve or create the user.
        $http({
            method: 'POST',
            url: apiUrl + '/users',
            data: {
                "email": $scope.user.email,
                "pseudo": $scope.user.pseudo,
                "password": $scope.user.password
            }
        }).success(function(user) {



            // If successful, give the user to the authentication service.
            AuthService.setUser(user);

            // Hide the loading message.
            $ionicLoading.hide();

            // Set the next view as the root of the history.
            // Otherwise, the next screen will have a "back" arrow pointing back to the login screen.
            $ionicHistory.nextViewOptions({
                disableBack: true,
                historyRoot: true
            });

            // Go to the issue creation tab.
            $state.go('login');

        }).error(function(user) {

            console.log("eroor");

            // If an error occurs, hide the loading message and show an error message.
            $ionicLoading.hide();
            $scope.error = 'Could not log in.';
        });


    }

})


.controller('LoginCtrl', function($scope, AuthService, $ionicHistory, $rootScope, $ionicPopup, $state, apiUrl, $ionicLoading, $http) {
    $scope.$on('$ionicView.beforeEnter', function() {
        // Initialize (or re-initialize) the user object.
        // The first name and last name will be automatically filled from the form thanks to AngularJS's two-way binding.
        $scope.user = {};

        $scope.user.email = "flo@flo.com";
        $scope.user.password = "1234";

    });



    $scope.goRegister = function() {

        $state.go('register')

    }

    $scope.login = function() {

        // Forget the previous error (if any).
        delete $scope.error;

        // Show a loading message if the request takes too long.
        $ionicLoading.show({
            template: 'Logging in...',
            delay: 750
        });


        // Make the request to retrieve or create the user.
        $http({
            method: 'POST',
            url: apiUrl + '/users/login',
            data: {
                "email": $scope.user.email,
                "password": $scope.user.password
            }
        }).success(function(user) {



            $rootScope.user = user;
            console.log(user);
            AuthService.setSalt(user);
            AuthService.setUser(user);
            // Hide the loading message.
            $ionicLoading.hide();

            // Set the next view as the root of the history.
            // Otherwise, the next screen will have a "back" arrow pointing back to the login screen.
            $ionicHistory.nextViewOptions({
                disableBack: true,
                historyRoot: true
            });

            // Go to the issue creation tab.
            $state.go('tab.dash');

        }).error(function() {

            console.log("erroe");

            $ionicLoading.hide();

            $scope.user.password = {};

            $scope.errorLogin = {};
            $scope.errorLogin = "Email ou mot de passe incorrect";
            console.log($scope.errorLogin);


            //   showAlert = function() {

            //     var alertPopup = $ionicPopup.alert({
            //       title: '',
            //       template: 'It might taste good'
            //     });
            //     alertPopup.then(function(res) {
            //       console.log('Thank you for not eating my delicious ice cream cone');
            //     });
            //   };
            // showAlert();


        });


    }
})

.controller('LogoutCtrl', function(AuthService, $scope, $state) {

    $scope.logOut = function() {
        AuthService.unsetUser();
        console.log('logout');
        $state.go('login');
    };


})