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
angular.module('starter.services', ['angular-storage'])

.service('AuthService', function(store,$rootScope) {

  var service = {
    currentUser: store.get('currentUser'),


    setUser: function(user) {

      service.currentUser = user;
      store.set('currentUser', user); // stock userid la je pourrais rajouter se role
    },

    unsetUser: function() {
      service.currentUser = null;
      store.remove('currentUser');

    }
  };

  return service;
})

.service('HardwareBackButtonManager', function($ionicPlatform) {
    this.deregister = undefined;

    this.disable = function() {
        this.deregister = $ionicPlatform.registerBackButtonAction(function(e) {
            e.preventDefault();
            return false;
        }, 101);
    }

    this.enable = function() {
        if (this.deregister !== undefined) {
            this.deregister();
            this.deregister = undefined;
        }
    }
    return this;
})
