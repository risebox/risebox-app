angular.module('risebox.controllers', [])

.controller('RegisterDeviceCtrl', function($scope, $state) {

  $scope.registerDevice = function(user) {
    console.log('Register Device', user);
    $state.go('tabs.box');
  };

})

.controller('ChemistryCtrl', function($scope, $interval) {
    $scope.runTimer = function() {
        secondsToWait = 60
        timer = $interval(function(){
                    secondsToWait = secondsToWait - 1;
                    $scope.remainingSeconds = secondsToWait
                    if (secondsToWait == 0) {
                        $interval.cancel(timer);
                        timer = undefined;
                    }
                }, 1000);
    };
})

;