angular.module('risebox.controllers')

.controller('AboutCtrl', function($scope, $ionicPopup, Versioning) {

  var confirmReload = function() {
    $ionicPopup.confirm({
      title: 'Mise à jour prête',
      template: "Votre app est à prête. L'application va maintenant redémarrer."
    }).then(function(res) {
      if(res) {
        Versioning.finishUpdate();
      } else {
        $state.go('tabs.help');
      }
    });
  };

  $scope.checkForUpdates = function() {
    Versioning.checkForUpdates(function(hasUpdate){
      $scope.hasUpdate = hasUpdate
      if ($scope.hasUpdate == true){
        $ionicPopup.alert({
          title: "Mise à jour disponible !",
          template: "Appuyez sur le bouton Mettre à jour pour télécharger et installer la dernière version de l'app"
        });
      } else {
        $ionicPopup.alert({
          title: "Bravo",
          template: "Votre app est à jour. Happy growing :)"
        });
      }
    });
  }

  $scope.updateApp = function() {
    $scope.progressPct = 0;
    $scope.showProgress = true;
    Versioning.prepareUpdate(function(res){
      $scope.showProgress = false;
      confirmReload();
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

});