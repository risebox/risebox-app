angular.module('risebox.controllers')

.controller('LightStatusCtrl', function($ionicPopup, $scope, Light) {

    var configRetrievalSuccess = function(result){
      $scope.light = result;
    }

    var configRetrievalError = function(err){
      console.log("Désolé impossible de récupérer la configuration résultats")
    }

    $scope.getLightConfig = function(){
      Light.getConfig()
          .then(function(result) {
            configRetrievalSuccess(result);
          }, function(err) {
            configRetrievalError(err);
          });
    }

    $scope.setLightRecipe = function(level, recipe){
      Light.setRecipe(level, recipe).then(function() {
            console.log("Lumière " + level + " mise à jour en " + recipe);
            $scope.getLightConfig();
          }, function(err) {
            $ionicPopup.alert({
              title: "Eclairage inchangé",
              template: "La mise à jour de la couleur n'a pas fonctionné. Retentez plus tard."
            });
          });
    }

    $scope.switchDarkMode = function(){
      if ($scope.light['dark_mode'] == true){
        Light.temporaryOff().then(function() {
              console.log('lights off for 10 minutes more...');
              $scope.getLightConfig();
            }, function(err) {
              $ionicPopup.alert({
                title: "Eclairage inchangé",
                template: "La mise à jour DarkMode n'a pas fonctionné. Retentez plus tard."
              });
            });
      }
      else {
        Light.on().then(function() {
              console.log('lights on');
              $scope.getLightConfig();
            }, function(err) {
              $ionicPopup.alert({
                title: "Eclairage inchangé",
                template: "La mise à jour DarkMode n'a pas fonctionné. Retentez plus tard."
              });
            });
      }
    }


    //Run when controllers starts
    $scope.getLightConfig();
    //TODO recupLightConfig every xx sec  on this page to update in case darkMode is back off or settings changed on server.

    $scope.headerSpace = ionic.Platform.isIOS();
})

;