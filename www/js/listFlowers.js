var appListFlowers = angular.module('starter.details', ['starter.services','starter.factory']);

appListFlowers.controller('listFlowers', function($scope, apiUrl,HardwareBackButtonManager, $stateParams, flowersService, $state) {

	 $scope.listCanSwipe = true;

	$scope.items = [{
		title : "titre 1",
		description : "desc 1"
	},
	 {
		title : "titre 2",
		description : "desc 2"
	}]



})