angular.module('risebox.controllers')

.controller('ChemistryCtrl', function($scope, $state, $timeout, $interval, $cordovaCamera, $ionicPopup, $ionicLoading, $q, Uploader, ArCode) {
    $scope.remainingSeconds = 1;
    $scope.cameraImage = null;

    function sleep(milliseconds) {
      var start = new Date().getTime();
      for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
          break;
        }
      }
    }

    $scope.runTimer = function() {
      timer = $interval(function(){
                $scope.remainingSeconds = $scope.remainingSeconds - 1
                if ($scope.remainingSeconds == 0) {
                  $interval.cancel(timer);
                  timer = undefined;

                  $scope.getPhoto();

                  // $scope.getPhoto().then(function(imageData) {
                  //   console.log(imageData);
                  //   console.log('$scope.getPhoto() DONE');
                  //   $scope.lastPhoto = imageData;
                  //   $scope.detectArCode().then(function() {
                  //     console.log('$scope.detectArCode() DONE');
                  //     $scope.uploadCroppedImage()
                  //     console.log('$scope.uploadCroppedImage() DONE');
                  //   });
                  // });

                }
      }, 1000);
    };

    $scope.getPhoto = function() {
      $cordovaCamera.getPicture().then(function(imageData) {
        $ionicLoading.show();
        $scope.lastPhoto = imageData;

        $timeout(function() {
          $scope.detectArCode();
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

    $scope.detectArCode = function() {
      canvas = document.getElementById("canvas");
      context = canvas.getContext("2d");

      detector = new AR.Detector();

      var imageObj = document.getElementById("imgCamera");

      console.log("imageObj");
      console.log(imageObj);

      console.log("imageObj.width");
      console.log(imageObj.width);
      console.log("imageObj.height");
      console.log(imageObj.height);

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
        $ionicLoading.hide();
        $ionicPopup.alert({
            title: "Oups... l'image n'est pas lisible....",
            template: "J'essaye à nouveau"
          });
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

        $scope.uploadCroppedImage();
      }
  };

  $scope.uploadCroppedImage = function() {
    canvas2 = document.getElementById("canvas2");
    dataURL = canvas2.toDataURL();

    var fileName = "raw_strip" + (new Date()).getTime() + ".jpg";

    Uploader.upload(dataURL, fileName, function() {
      $ionicLoading.hide();
      $ionicPopup.alert({
        title: "Ok test enregistré....",
        template: "Le traitement de l'image est en cours... Vous recevrez une notification lorsque l'analyse sera terminée"
      });
      $state.go('tabs.box');
    }, function(){
      $ionicLoading.hide();
      $ionicPopup.alert({
        title: "Oups... l'image n'a pas pu être traitée...",
        template: "Vérifier votre connexion réseau et essayez à nouveau"
      });
    });
  };
})

;