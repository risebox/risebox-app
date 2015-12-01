angular.module('risebox.controllers')

.controller('RegisterDeviceCtrl', function($scope, $state, $ionicPopup, RiseboxApi, RiseboxObj, IonicProxy, Versioning) {

  $scope.registerDevice = function(user) {
    RiseboxApi.registerDevice(user.email, user.secret, {"origin": ionic.Platform.device()})
                .then(function(response) {

                  RiseboxObj.storeToken(response.result.token);
                  RiseboxApi.login(RiseboxObj.getToken(), {"origin": 'some'})
                  .then(function(response) {

                    RiseboxObj.setInfo(response.result);
                    IonicProxy.pushRegister();
                    $state.go('tabs.box');

                  }, function(err) {
                    console.log('Login error');
                    $ionicPopup.alert({
                      title: 'Oups ...',
                      template: "Erreur lors de l'enregistrement... Essaye à nouveau !"
                    });
                  });


                }, function(err) {
                  console.log('Register device error');
                  $ionicPopup.alert({
                    title: 'Oups ...',
                    template: "ID et token ne sont pas bons... Essaye encore !"
                  });
                })
  };

  $scope.checkForUpdates = function() {
    Versioning.checkForUpdates(function(hasUpdate){
      console.log('hasUpdate '+hasUpdate);
      $scope.hasUpdate = hasUpdate
    });
  };

  var confirmReload = function() {
    $ionicPopup.confirm({
      title: 'Mise à jour prête',
      template: "Votre app est à prête. L'application va maintenant redémarrer."
    }).then(function(res) {
      if(res) {
        Versioning.finishUpdate();
      } else {
        //RAS
      }
    });
  };

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

  $scope.checkForUpdates();

})