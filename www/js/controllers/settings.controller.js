angular.module('risebox.controllers')

.controller('SettingsCtrl', function($scope, RiseboxConf, $window) {
	
	var loadSettings = function(){
		$scope.env           = RiseboxConf.get('env');
		$scope.apiEndpoint   = RiseboxConf.get('RISEBOX_API_ENDPOINT');
		$scope.waitStripTime = RiseboxConf.get('STRIP_WAITING_TIME');
		$scope.deployChannel = RiseboxConf.get('IONIC_DEPLOY_CHANNEL');
	}

	$scope.setEnv = function(env){
		RiseboxConf.init(env);
		$scope.env = env;
		loadSettings();
	}

	$scope.saveConfig = function(){
		RiseboxConf.save();
		$window.location.reload(true)
	}

	loadSettings();
})