var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
    return window._; // assumes underscore has already been loaded on the page
});

angular.module('starter.factory', ['ngCordova'])



.factory('CameraService', ['$q', function($q) {

    return {
        getPicture: function(options) {


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
            $http.get("data/listeEsp.json", config).success(function(data) {
                callback(null, data);
            }).error(function(error) {
                callback(error);
            });
        }
    };

})


.factory("flowersService", function($http, apiUrl) {

    var config = {
        headers: {
            "Content-type": "application/json"
        }
    };
    return {
        getflowers: function(callback) {
            $http.get(apiUrl + "/fleurs", config).success(function(data) {
                callback(null, data);
            }).error(function(error) {
                callback(error);
            });
        },
        getByIdflower: function(callback, flowerId) {
            $http.get(apiUrl + "/fleurs/" + flowerId, config).success(function(data) {
                callback(null, data);
            }).error(function(error) {
                callback(error);
            });
        }
    };

})






