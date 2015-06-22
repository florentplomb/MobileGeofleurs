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
