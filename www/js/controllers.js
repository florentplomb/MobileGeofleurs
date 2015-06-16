angular.module('starter.controllers', ['starter.services', 'ionic', 'leaflet-directive', 'ngCordova', 'angucomplete-alt'])

.constant('apiUrl', 'http://localhost:8100/api-proxy')
//.constant('apiUrl', 'http://geofleurs.herokuapp.com/api')

.controller('DashCtrl', function($scope, $state, $ionicPopup) {


})

.controller('MapCtrl', function($scope, $cordovaGeolocation, leafletData, $ionicPopup, $log, $timeout, EspService) {

    $scope.searchEsp = "NOMC";



    $scope.$watch(function() {
        return $scope.searchEsp;
    }, function(newValue, oldValue) {
        console.log($scope.searchEsp)
    });


    $scope.center = {
        lat: 46.841759385352,
        lng: 6.64475440979004,
        zoom: 10
    };

    $scope.geoloc1 = true;
    $scope.geoloc2 = false;
    $scope.geoloc3 = false;

    EspService.getEspName(function(err, data) {
        if (err) $scope.error = err;
        $scope.espNames = data;
    })



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
            // lc.start();

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
            console.log(e.latlng);
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



    $scope.$on('$ionicView.beforeEnter', function() {
        // Initialize (or re-initialize) the user object.
        // The first name and last name will be automatically filled from the form thanks to AngularJS's two-way binding.

        $timeout(function() {
            $scope.$broadcast('invalidateSize');

        });



    })


    $scope.markers = [];
    var myPosition = {
        iconUrl: "img/redicon.png",
        iconSize: [34, 39],
        iconAnchor: [14, 40]
    };


    // geolocation.getLocation().then(function(data) {
    //   $scope.center.lat = data.coords.latitude;
    //   $scope.center.lng = data.coords.longitude;
    //   $scope.center.zoom = 17;


    //   var pos = {
    //     lat: data.coords.latitude,
    //     lng: data.coords.longitude,
    //     icon: myPosition
    //   };

    //   $scope.markers.push(pos);
    //   $scope.geolocOn = true;
    // }, function(error) {
    //   pop();
    //   $log.error("Could not get location: " + error);
    // });



    var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + "cleliapanchaud.kajpf86n";
    mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + "pk.eyJ1IjoiY2xlbGlhcGFuY2hhdWQiLCJhIjoiM2hMOEVXYyJ9.olp7FrLzmzSadE07IY8OMQ";
    $scope.defaults = {
        tileLayer: mapboxTileLayer
    };
})



.controller('PhotoCtrl', function($scope, $state, $ionicPopup, CameraService, apiUrl, $http,$ionicLoading) {

    $scope.showPopup = function() {

        $scope.data = {}

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

                    $scope.showPopup2();

                }
            }]
        });

    }




    $scope.showPopup2 = function() {

        $scope.data = {}

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            templateUrl: "templates/getNameFlower.html",
            title: "Nom de l'espèce observée ",
            scope: $scope,
            cssClass: "poop",
            buttons: [{
                text: 'Cancel'
            }, {
                text: '<b>Save</b>',
                type: 'button-positive',
                onTap: function(e) {
                    if (!$scope.data.wifi) {
                        //don't allow the user to close unless he enters wifi password
                        e.preventDefault();
                    } else {
                        return $scope.data.wifi;
                    }
                }
            }]
        });

    }




    $scope.getPhoto = function() {

        $ionicLoading.show({
        template: 'Logging in...',
        delay: 750
      });

        $http({
            method: "POST",
            url: apiUrl + "/images",
            headers: {
                "Content-type": "application/json"
            },
            data: {
                "imageB64": "adsasdada"
            }
        }).success(function(idImg) {

            $ionicLoading.hide();

            $scope.showPopup();





            //  $scope.newIssue.photo = data.url;

        }).error(function(err) {
            alert("error de chargement de l'image");
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

            console.log("hola");
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
            $http.get(apiUrl + "/espnames", config).success(function(data) {
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


.controller('ChatsCtrl', function($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };
})
