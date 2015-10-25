angular.module('risebox.services')

.factory('App', function(Access, Ionic, $state, $cordovaNetwork, Versioning) {

  var init = function(success, error) {
    console.log('Risebox App: Initializing...');
    var isOnline = $cordovaNetwork.isOnline();
    if (isOnline){
      start(success, error);
    } else {
      console.log('You are offline : you need to connect to use app');
      error();
    }
  }

  var start = function(success, error){
    Access.login().then(function(){
      Versioning.checkForUpdates(function(update){
        Ionic.pushRegister();
        success();
      });
    });
  }

  return {
    init: init,
    start: start
  }

});