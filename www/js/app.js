// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform,$ionicPopup) {


  $ionicPlatform.ready(function() {

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }


    if(window.Connection) {


                if(navigator.connection.type == Connection.NONE) {
                    $ionicPopup.alert({
                        title: "Internet Disconnected",
                        content: "Please check your data connection and start app again"
                    })
                    .then(function() {

                            ionic.Platform.exitApp();
                        })

                }
            }
  });
})
       .run(function (AuthService, $rootScope, $state) {
            $rootScope.$on('$stateChangeStart', function (event, toState) {
           // If the user is not logged in and is trying to access another state than "login"...
        if (!AuthService.currentUser && toState.name !== 'login' && toState.name !== 'register') {
            console.log('Activating login');

// ... then cancel the transition and go to the "login" state instead.
            event.preventDefault();
            $state.go('login');
        }



            });
        })

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
    $ionicConfigProvider.tabs.position('bottom');

    $stateProvider


  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',

    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',

      }
    }
  })

    .state('tab.flowerDetails', {
    // We use a parameterized route for this state.
    // That way we'll know which issue to display the details of.
    url: '/flowerDetails/:flowerId',

    views:{
      'tab-dash':{
       templateUrl: 'templates/issueDetails.html',

     }

    }
      // Here we use the same "tab-issueList" view as the previous state.
      // This means that the issue details template will be displayed in the same tab as the issue list.

  })

                    .state('login', {
      url: '/login',
      controller:'LoginCtrl',
      templateUrl: 'templates/login.html'
  })


          .state('register', {
      url: '/register',
      controller:'RegisterCtrl',
      templateUrl: 'templates/register.html'
      })


  // if none of the above states are matched, use this as the fallback
          $urlRouterProvider.otherwise(function ($injector) {
                $injector.get('$state').go('tab.dash');
            });



});
