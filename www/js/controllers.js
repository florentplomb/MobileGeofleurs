var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
    return window._; // assumes underscore has already been loaded on the page
});

angular.module('starter.controllers', ['starter.services', 'ionic', 'leaflet-directive', 'ngCordova', 'angucomplete-alt'])

//.constant('apiUrl', 'http://localhost:8100/api-proxy')
//.constant('apiUrl', 'http://localhost:8100/local-proxy')
    .constant('apiUrl', 'http://geoflowers.herokuapp.com/api')



.controller('MapCtrl', function($scope,$state, apiUrl,$rootScope, flowersService,$cordovaGeolocation, leafletData, $ionicPopup, $log, $timeout, EspService) {


    $scope.searchEsp = "NOMC";
    $scope.searchEspInv = "NOML";
    $scope.valideEsp = "";


    $scope.markers = [];


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



             flowersService.getflowers(function(err, flowers) {
        if (err) $scope.error = err;

           angular.forEach(flowers, function(flower) {



                $scope.urlImgID = apiUrl+"/images/"+flower.properties.image;

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


    });



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
                follow: true, // follow the user's location
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

.controller('DetailCtrl', function($scope,apiUrl, $stateParams, flowersService, $state) {


            var flowerId = $stateParams.flowerId;

            $scope.urlImg = apiUrl+"/images/"
            flowersService.getByIdflower(function(err, flower) {
        if (err) $scope.error = err;

        $scope.flower = flower;

    },flowerId);


})

.controller('PhotoCtrl', function($scope,flowersService, $rootScope, $state, $ionicPopup, CameraService, apiUrl, $http, $ionicLoading) {




        $scope.$watch(function() {
        return $scope.selectEsp;
    }, function() {

         $rootScope.selEsp = $scope.selectEsp;

    })

    $scope.newFlower = {
        type : "Feature",
        properties : {
            commune : "",
            image : "",
            espece : "",
        },
        geometry: {
            type: "Point",
            coordinates: []
        }
    };



    $scope.ifKnowName = function(positionPhoto) {

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            templateUrl: "templates/ifName.html",
            title: "Connaissez-vous le nom de l'espèce observée ?",
            scope: $scope,
            buttons: [{
                text: 'Non'
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
                text: 'Non'
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


        $http({
            method: "POST",
            url: apiUrl + "/flowers",
            headers: {
                "Content-type": "application/json"
            },
            data: {
                "flower" : $scope.newFlower
            }
        }).success(function(data) {

            $ionicLoading.hide();

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

    var containsObject = function(obj, list) {

        var i;
        for (i = 0; i < list.length; i++) {
            if (_.isEqual(list[i], obj)) {
                return true;
            }
        }
        return false;
    }



    $scope.publier = function() {

        console.log("public" + $scope.selectEsp)

        // console.log($scope.selectEsp.originalObject.NOMC)

        // if (!$scope.selectEsp) {
        //     $scope.invEsp = true;
        //     console.log($scope.invEsp);
        // } else {
        //     $scope.invEsp = false;
        //     console.log("hoooo");
        //     console.log(containsObject($scope.selectEsp.originalObject, $scope.espNames));
        // }
    }

    $scope.getPhoto = function() {

        var lng = $scope.position.lng
        var lat = $scope.position.lat

        $scope.newFlower.geometry.coordinates.push(lng);
        $scope.newFlower.geometry.coordinates.push(lat);

        console.log($scope.newFlower);

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
                "imageB64": "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"
            }
        }).success(function(idImg) {

            $ionicLoading.hide();

            $scope.UrlnewImg = apiUrl + "/images/" + idImg;
            $scope.newImgId = idImg;
            $scope.ifKnowName();


        }).error(function(err) {
            $ionicLoading.hide();
            alert("Erreur au chargement de l'image");

        });


        $http({
                method: "POST",
                url: apiUrl + "/communes/geoloc",
                headers: {
                    "Content-type": "application/json"
                },
                data: {
                    "zone" : $scope.newFlower
                }
            }).success(function(data) {


               $scope.newCommune =  data ;

               console.log($scope.newCommune);


            }).error(function(err) {
                 $scope.newCommune = {} ;
                alert("Commune introuvable");

            });

    }
})



//   CameraService.getPicture({
//     quality: 100,
//     targetWidth: 400,
//     targetHeight: 600,
//     saveToPhotoAlbum: false,
//     correctOrientation: true,
//     encodingType: navigator.camera.EncodingType.JPEG,
//     destinationType: navigator.camera.DestinationType.DATA_URL
//   }).then(function(imageData) {



//     $http({
//       method: "POST",
//       url: apiUrl + "/images",
//       headers: {
//         "Content-type": "application/json"
//       },
//       data: {
//         "imageB64": imageData
//       }
//     }).success(function(data) {


//       alert("sucess");


//       //  $scope.newIssue.photo = data.url;

//     });
//   }, function(err) {
//     alert("erorr" + err);

//     $scope.error = err;
//   });

// };

// })



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
         getByIdflower: function(callback,flowerId) {
            $http.get(apiUrl + "/fleurs/"+flowerId, config).success(function(data) {
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


