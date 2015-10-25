angular.module('risebox.services')

.factory('Versioning', function($ionicDeploy, EnvConfig) {

  $ionicDeploy.setChannel(EnvConfig.IONIC_DEPLOY_CHANNEL);

  var updateAvailability = false;

  var updateAvailable = function() {
    return updateAvailability;
  }

  var checkForUpdates = function(callback) {
    console.log('Ionic Deploy: Checking for updates on channel ' + EnvConfig.IONIC_DEPLOY_CHANNEL);
    $ionicDeploy.check().then(function(hasUpdate) {
      updateAvailability = hasUpdate;
      console.log('Ionic Deploy: updateAvailability is ' + hasUpdate);
      callback(hasUpdate);
    }, function(err) {
      console.error('Ionic Deploy: Unable to check for updates', err);
      callback(false);
    });
  }

  var prepareUpdate = function(success, error, progress) {
    $ionicDeploy.download().then(function() {
      $ionicDeploy.extract().then(function() {
        console.log('Ionic Deploy: Update Ready to load! ');
        success();
      });
    }, function(err) {
      console.log('Ionic Deploy: Update error! ', err);
      error(err);
    }, function(prog) {
      console.log('Ionic Deploy: Progress... ', prog);
      progress(prog);
    });
  }

  var finishUpdate = function() {
    updateAvailability = false;
    $ionicDeploy.load();
  }

  return {
    checkForUpdates: checkForUpdates,
    prepareUpdate: prepareUpdate,
    finishUpdate: finishUpdate,
    updateAvailable: updateAvailable
  }
})

;