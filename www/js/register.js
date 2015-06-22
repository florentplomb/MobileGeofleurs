var appRegister = angular.module('starter.register', ['starter.services','starter.factory']);

appRegister.controller('RegisterCtrl', function($scope, AuthService, $ionicHistory, $rootScope, $ionicPopup, $state, apiUrl, $ionicLoading, $http) {

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
            $state.go('tab.dash');

        }).error(function(user) {

            console.log("eroor");

            // If an error occurs, hide the loading message and show an error message.
            $ionicLoading.hide();
            $scope.error = 'Could not log in.';
        });


    }

})