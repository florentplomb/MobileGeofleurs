angular.module('starter.services', ['angular-storage'])

.service('AuthService', function(store,$rootScope) {

  var service = {
    currentUser: store.get('currentUser'),


    setUser: function(user) {
      console.log(user);
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

