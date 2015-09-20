angular.module('risebox.controllers')

.controller('LightStatusCtrl', function($scope, $stateParams, RiseboxApi, RiseboxObj) {
    var statusSuccess = function(result){
      var raw_settings = result.result;
      $scope.lightSettings = cleanSettings(raw_settings);
    }

    var statusError = function(err){
      console.log("Désolé impossible de récupérer vos résultats")
    }

    RiseboxApi.getLightStatus( RiseboxObj.getInfo().device.key,
                               RiseboxObj.getInfo().device.token)
                  .then(function(result) {
                    statusSuccess(result);
                  }, function(err) {
                    statusError(err);
                  });

    var cleanSettings = function(settings) {
      var cleanSettings = {};
      settings.forEach(function(setting) {
        cleanSettings[setting.key] = setting.value;
      });
      return cleanSettings;
    }
})

;