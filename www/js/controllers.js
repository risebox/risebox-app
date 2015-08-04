angular.module('risebox.controllers', [])

.controller('RegisterDeviceCtrl', function($scope, $state) {

  $scope.registerDevice = function(user) {
    console.log('Register Device', user);
    $state.go('tabs.box');
  };

})

.controller('ChemistryCtrl', function($scope, $interval) {
    $scope.remainingSeconds = 60;

    $scope.runTimer = function() {
        // secondsToWait = 60
        timer = $interval(function(){
                    // secondsToWait = secondsToWait - 1;
                    // $scope.remainingSeconds = secondsToWait
                    $scope.remainingSeconds -= 1
                    if ($scope.remainingSeconds == 0) {
                        $interval.cancel(timer);
                        timer = undefined;
                    }
                }, 1000);
    };
})

;