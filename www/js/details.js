var appDetails = angular.module('starter.details', ['starter.services','starter.factory']);

appDetails.controller('DetailCtrl', function($scope, apiUrl,HardwareBackButtonManager, $stateParams, flowersService, $state) {



    var flowerId = $stateParams.flowerId;

    $scope.urlImg = apiUrl + "/images/"
    flowersService.getByIdflower(function(err, flower) {
        if (err) {
            $scope.error = err;
            $scope.showAlert("Publication indisponible");
        }

        $scope.flower = flower;

    }, flowerId);


})