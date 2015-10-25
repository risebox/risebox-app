angular.module('risebox.services')

.factory('App', function(Access, Ionic, $state, $cordovaNetwork, Versioning) {

  var init = function(success, error) {
    console.log('Risebox App: Initializing...');
    var isOnline = $cordovaNetwork.isOnline();
    if (isOnline){
      Access.login().then(function(){
        Ionic.pushRegister();
        Versioning.checkForUpdates(function(){});
        success();
      });
    } else {
      console.log('You are offline : you need to connect to use app');
      error();
    }
  }

  return {
    init: init
  }

});