angular.module('starter.controllers', ['starter.services'])

.constant('apiUrl', 'http://localhost:8100/api-proxy')


.controller('DashCtrl', function($scope, $state) {


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

    //  $scope.user.email = "flo@flo.com";
    // $scope.user.password = "1234";
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
       console.log ($scope.errorLogin);


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
});