angular.module('risebox.controllers', [])

.controller('RegisterDeviceCtrl', function($scope, $state) {

  $scope.registerDevice = function(user) {
    console.log('Register Device', user);
    $state.go('tabs.box');
  };

})

.controller('ChemistryCtrl', function($scope, $state) {

})

;