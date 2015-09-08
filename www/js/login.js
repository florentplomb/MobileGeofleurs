var appLogin = angular.module('starter.login', ['starter.services','starter.factory']);

appLogin.controller('LoginCtrl', function($scope, AuthService, $ionicHistory, $rootScope, $ionicPopup, $state, apiUrl, $ionicLoading, $http) {
    $scope.$on('$ionicView.beforeEnter', function() {
        // Initialize (or re-initialize) the user object.
        // The first name and last name will be automatically filled from the form thanks to AngularJS's two-way binding.
        $scope.user = {};


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
            console.log(user);
            $rootScope.user = {};
            console.log(user);
            AuthService.setUser(user);
            $rootScope.currentUser = AuthService.currentUser;

                // Hide the loading message.
            $ionicLoading.hide();

            // Set the next view as the root of the history.
            // Otherwise, the next screen will have a "back" arrow pointing back to the login screen.

            $ionicHistory.nextViewOptions({
                disableBack: true,
                 historyRoot: true
            });

            // Go to the issue creation tab.
            $state.go('map');

        }).error(function() {


            $ionicLoading.hide();

            $scope.user.password = {};

            $scope.errorLogin = {};
            $scope.errorLogin = "Email ou mot de passe incorrect";




        });


    }
});

appLogin.controller('LogoutCtrl', function($ionicHistory,AuthService,$ionicPopup, $rootScope, $scope, $state) {
    $scope.logOut = function() {
console.log("sadads");

   var confirmPopup = $ionicPopup.confirm({
     title: 'Log Out',
     template: "Voulez-vous vraiment changer d'utilisateur ? "
   });
   confirmPopup.then(function(res) {
     if(res) {
            $ionicHistory.nextViewOptions({
                disableBack: true,
                 historyRoot: true
            });


        AuthService.unsetUser();
        $rootScope.currentUser = null;
        console.log('logout');
        $state.go('login');
     } else {

     }
   });



    };



});


