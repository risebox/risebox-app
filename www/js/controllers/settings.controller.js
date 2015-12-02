angular.module('risebox.controllers')

.controller('SettingsCtrl', function($scope, RiseboxApi, RiseboxObj) {
	$scope.setApiEndpoint = function(env){
		console.log('apiEndpoint is '+env);
	}
})