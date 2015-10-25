angular.module('risebox.controllers')

.controller('BoxCtrl', function($state, $scope, $ionicPopup, Box, Versioning) {

  if (Versioning.updateAvailable()){

    var confirmPopup = $ionicPopup.show({
      title: "Mise à jour disponible !",
      template: "Appuyez sur Mettre à jour pour télécharger et installer la dernière version de app <br/><progress max=\"100\" value=\"{{progressPct}}\" ng-if=\"showProgress\"> </progress>",
      scope: $scope, // Scope (optional). A scope to link to the popup content.
      buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
        text: 'Plus tard',
        type: 'button-default',
        onTap: function(e) {
          // Returning a value will cause the promise to resolve with the given value.
          // return $scope.data.response;
          return false;
        }
      }, {
        text: 'Mettre à jour',
        type: 'button-positive',
        onTap: function(e) {
          e.preventDefault();
          $scope.progressPct = 0;
          $scope.showProgress = true;
          Versioning.prepareUpdate(function(res){
            $scope.showProgress = false;
            Versioning.finishUpdate();
          }, function(err){
            $ionicPopup.alert({
              title: "Erreur :(",
              template: "Une erreur est survenue lors de la mise à jour : essayez plus tard."
            });
            $scope.showProgress = false;
          }, function(prog){
            $scope.progressPct = prog;
          });
        }
      }]
    });

  } else {
    console.log('No update available');
  }

  var loadBoxStatus = function(){
    // Box.loadAlerts();
  }

  loadBoxStatus();

});