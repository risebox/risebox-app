angular.module('risebox.controllers')

.controller('ChemistryNewCtrl', function($scope, $state, $stateParams, $timeout, $interval, $cordovaCamera, $ionicPopup, $ionicLoading, Uploader, ArCode) {
    $scope.secondsToWait = $scope.remainingSeconds = 3  ;

    $scope.testStrip = function() {
      countdown(function(){
        getPhoto(function(){
          detectArCode(function(){
            uploadCroppedImage(
              function(){
                testSuccess("Le traitement de l'image est en cours... Vous recevrez une notification lorsque l'analyse sera terminée")
              },
              function(){
                testFail("Vérifier votre connexion réseau et essayez à nouveau")
              }
            );
          });
        });
      });
    };

    var initCountdown = function() {
      $scope.remainingSeconds = $scope.secondsToWait;
      $scope.lastPhoto = null; //TODO change to other method so that it removes photo from screen
    };

    var testSuccess = function(text) {
      $ionicLoading.hide();
      $ionicPopup.alert({
        title: "Votre image est correcte",
        template: text
      });
      initCountdown();
      $state.go('tabs.box');
    };

    var testFail = function(text) {
      $ionicLoading.hide();
      $ionicPopup.alert({
        title: "Erreur lors du traitement de l'image",
        template: text
      });
    };

    var countdown = function(callback) {
      timer = $interval(function(){
                if ($scope.remainingSeconds == 0) {
                  $interval.cancel(timer);
                  timer = undefined;
                  callback();
                } else {
                  $scope.remainingSeconds = $scope.remainingSeconds - 1
                }
      }, 1000);
    };

    var getPhoto = function(callback) {
      $cordovaCamera.getPicture().then(function(imageData) {
        $ionicLoading.show();
        $scope.lastPhoto = imageData;

        $timeout(function() {
          callback();
        }, 1000, false);
      }, function(err) {
        console.err(err);
      }, {
        quality: 100,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 480,
        targetHeight: 640,
        saveToPhotoAlbum: false
      });
    };

    var detectArCode = function(callback) {
      canvas = document.getElementById("canvas");
      context = canvas.getContext("2d");

      detector = new AR.Detector();

      var imageObj = document.getElementById("imgCamera");

      canvas.width = parseInt(imageObj.width);
      canvas.height = parseInt(imageObj.height);

      context.drawImage(imageObj, 0, 0, imageObj.width, imageObj.height);
      imageData = context.getImageData(0, 0, imageObj.width, imageObj.height);

      var markers = detector.detect(imageData);

      // ArCode.drawCorners(markers, context);
      // ArCode.drawId(markers, context);

      // imageObj.remove();
      // canvas.remove();

      if (markers.length < 3) {
        console.log('Not enough markers, please do it again !');
        testFail("l'image n'est pas lisible....");
      }
      else {
        console.log('Enough markers: will crop now');

        xRatio = imageObj.naturalWidth / imageObj.width;
        yRatio = imageObj.naturalHeight / imageObj.height;

        // WORKS WITH CROP
        var newMarkers = ArCode.getMarkerCorners(markers, context);

        var pixelsFromULCornerToStrip = 175;
        var pixelsBelowBottomCorner = 90;

        var sourceX = newMarkers[1]['ur'].x * xRatio + pixelsFromULCornerToStrip;
        var sourceY = newMarkers[1]['ur'].y * yRatio;
        var sourceWidth  = (newMarkers[68]['ul'].x - newMarkers[1]['ur'].x) * xRatio - (pixelsFromULCornerToStrip *2);
        var sourceHeight = (newMarkers[0]['lr'].y - newMarkers[1]['ur'].y) * yRatio + pixelsBelowBottomCorner;
        var destX = 0;
        var destY = 0;
        var destWidth  = sourceWidth;
        var destHeight = sourceHeight;

        // Divide by Ratio if want smaller image uploaded
        // var destWidth  = sourceWidth / xRatio;
        // var destHeight = sourceHeight / yRatio;

        //Draw the uploaded image on screen
        var canvas2 = document.getElementById("canvas2");
        context2 = canvas2.getContext("2d");
        canvas2.width  = destWidth;
        canvas2.height = destHeight;
        context2.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);

        callback();
      }
  };

  var uploadCroppedImage = function(success, error) {
    canvas2 = document.getElementById("canvas2");
    dataURL = canvas2.toDataURL();

    var fileName = "raw_strip" + (new Date()).getTime() + ".jpg";

    Uploader.upload(dataURL, fileName, success, error);
  };

})

;