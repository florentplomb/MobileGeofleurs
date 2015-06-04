angular.module('starter.services', ['angular-storage'])

.service('AuthService', function(store,$rootScope) {

  var service = {
    currentUserId: store.get('currentUserId'),
    currentUserId: store.get('currentUserSalt'),

    setUser: function(user) {
      console.log(user._id);
      service.currentUserId = user._id;
      store.set('currentUserId', user._id); // stock userid la je pourrais rajouter se role
    },
    setSalt: function(user) {
      service.currentUserSalt = user.salt;
      store.set('currentUserSalt', user.salt);

      $rootScope.currentUserSalt = store.get('currentUserSalt');
    },

    unsetUser: function() {
      service.currentUserId = null;
      service.currentUserSalt = null;
      store.remove('currentUserId');
      store.remove('currentUserSalt');
    }
  };

  return service;
})

