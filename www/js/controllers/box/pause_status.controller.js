angular.module('risebox.controllers')

.controller('PauseStatusCtrl', function($ionicPopup, $scope, PauseManager) {

    var configRetrievalSuccess = function(result){
      $scope.paused = result;
      if ($scope.paused.lights.status){
        $scope.remainingNoLightMins = computeRemainingTime($scope.paused.lights.end);
      }
      if ($scope.paused.full.status){
        $scope.remainingNoFullMins = computeRemainingTime($scope.paused.full.end);
      }
    }

    var computeRemainingTime = function (time){
      var now = new Date().getTime();
      var secs = parseInt(parseInt(Date.parse(time)-now)/60000);
        switch (true){
          case secs == 0:
            return "moins d'1 min"
            break;
          case secs == 1:
            return "1 min"
            break;
          case secs > 1:
            return secs + " mins"
            break;
        }
    }

    var configRetrievalError = function(err){
      console.log("Désolé impossible de récupérer la configuration des pauses");
    }

    $scope.getPauseConfig = function(){
      PauseManager.getConfig()
          .then(function(result) {
            configRetrievalSuccess(result);
          }, function(err) {
            configRetrievalError(err);
          });
    }

    $scope.switchLightState = function(level, recipe){
      if ($scope.paused.lights.status == true){
        PauseManager.temporaryLightsOff().then(function() {
          console.log('Lights off for a while...');
          $scope.getPauseConfig();
        }, function(err) {
          $ionicPopup.alert({
            title: "Eclairage inchangé",
            template: "La mise à jour DarkMode n'a pas fonctionné. Retentez plus tard."
          });
        });
      }
      else {
        PauseManager.lightsOn().then(function() {
          console.log('Lights on');
          $scope.getPauseConfig();
        }, function(err) {
          $ionicPopup.alert({
            title: "Eclairage inchangé",
            template: "La mise à jour DarkMode n'a pas fonctionné. Retentez plus tard."
          });
        });
      }
    }

    $scope.switchFullState = function(){
      if ($scope.paused.full.status == true){
        PauseManager.temporaryShutdown().then(function() {
          console.log('Entire Box silent for a while...');
          $scope.getPauseConfig();
        }, function(err) {
          $ionicPopup.alert({
            title: "Statut de la box inchangé",
            template: "La mise à jour Shutdown n'a pas fonctionné. Retentez plus tard."
          });
        });
      }
      else {
        PauseManager.fullOn().then(function() {
          console.log('Full on');
          $scope.getPauseConfig();
        }, function(err) {
          $ionicPopup.alert({
            title: "Statut de la box inchangé",
            template: "La mise à jour Shutdown n'a pas fonctionné. Retentez plus tard."
          });
        });
      }
    }


    //Run when controllers starts
    $scope.getPauseConfig();

    $scope.headerSpace = (ionic.Platform.isIOS() === true ? 'big' : 'small');
})

;