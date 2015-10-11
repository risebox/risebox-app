angular.module('risebox.services')

.factory('Box', function(RiseboxApi) {

  var loadAlerts = function(success, error) {
    console.log('Loading alerts');
  }

  return {
    loadAlerts: loadAlerts
  }

});