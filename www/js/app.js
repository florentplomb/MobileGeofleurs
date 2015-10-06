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
angular.module('starter', ['ionic', 'starter.factory', 'starter.services','starter.login','starter.map','starter.photo','starter.details','starter.register'])

//.constant('apiUrl', 'http://localhost:8100/api-proxy')
//.constant('apiUrl', 'http://localhost:8100/local-proxy')
.constant('apiUrl', 'http://geofleurs.herokuapp.com/api')

.run(function($ionicPlatform, $ionicPopup, $rootScope, $state,$ionicHistory) {


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


      if (window.Connection) {


        if (navigator.connection.type == Connection.NONE) {
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

 .run(function(AuthService, $rootScope, $state,$location) {
    $rootScope.$on('$stateChangeStart', function(event, toState) {


        if (AuthService.currentUser != null) {
                $location.path('map');
            }

      // If the user is not logged in and is trying to access another state than "login"...
      if (!AuthService.currentUser && toState.name !== 'login' && toState.name !== 'register') {
        console.log('Activating login');

        // ... then cancel the transition and go to the "login" state instead.
        event.preventDefault();
        $state.go('login');
      }

    });
  })

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

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

  // .state('tab.dash', {
  //   url: '/dash',

  //   views: {
  //     'tab-dash': {
  //       templateUrl: 'templates/tab-dash.html',

  //     }
  //   }
  // })

  .state('details', {
    // We use a parameterized route for this state.
    // That way we'll know which issue to display the details of.
    url: '/flowerDetails/:flowerId',
    templateUrl: 'templates/issueDetails.html'

  })


    .state('map', {
    url: '/map',
    templateUrl: 'templates/map.html'
  })


  .state('login', {
    url: '/login',
    controller: 'LoginCtrl',
    templateUrl: 'templates/login.html'
  })


  .state('register', {
    url: '/register',
    controller: 'RegisterCtrl',
    templateUrl: 'templates/register.html'
  })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise(function($injector) {
    $injector.get('$state').go('map');
  });



});