angular.module('risebox.controllers', [])

.controller('RegisterDeviceCtrl', function($scope, $state) {

  $scope.registerDevice = function(user) {
    console.log('Register Device', user);
    $state.go('tabs.box');
  };

})

.controller('ChemistryCtrl', function($scope, $interval, Camera) {
    // $scope.remainingSeconds = 60;
    $scope.remainingSeconds = 3;

    $scope.runTimer = function() {
      timer = $interval(function(){
                $scope.remainingSeconds = $scope.remainingSeconds - 1
                if ($scope.remainingSeconds == 0) {
                  $interval.cancel(timer);
                  timer = undefined;
                  $scope.getPhoto();
                }
      }, 1000);
    };

    $scope.getPhoto = function() {
        Camera.getPicture().then(function(imageURI) {
          // console.log(imageURI);
          $scope.lastPhoto = imageURI;
        }, function(err) {
          console.err(err);
        }, {
          quality: 100,
          targetWidth: 480,
          targetHeight: 640,
          saveToPhotoAlbum: false
        });
    };
})

;