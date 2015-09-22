angular.module('risebox.controllers')

.controller('LightStatusCtrl', function($ionicPopup, $scope, Light) {

    var statusSuccess = function(result){
      $scope.light = result;
    }

    var statusError = function(err){
      console.log("Désolé impossible de récupérer vos résultats")
    }

    $scope.getLight = function(){
      Light.getStatus()
          .then(function(result) {
            statusSuccess(result);
          }, function(err) {
            statusError(err);
          });
    }

    $scope.setLight = function(level, status){
      Light.setStatus(level, status)
          .then(function() {
            console.log("Lumière " + level + " mise à jour");
            $scope.getLight();
          }, function(err) {
            $ionicPopup.alert({
              title: "Eclairage inchangé",
              template: "La mise à jour de la couleur n'a pas fonctionné. Retentez plus tard."
            });
          });
    }

    //Run when controllers starts
    $scope.getLight();
})

;