angular.module('risebox.controllers')

.controller('ChemistryNewCtrl', function($scope, $state, $stateParams, $timeout, $interval, $cordovaCamera, $cordovaFile, $ionicPopup, $ionicLoading,
                                         Uploader, Strip, QRCode) {
  $scope.secondsToWait = $scope.remainingSeconds = 3  ;

  $scope.testStrip = function() {
    countdown(function(){
      getPhoto(function(){
        extractStrip(function(){
          uploadAndRunAnalyze(
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

  var initStripTest = function(wait) {
    document.getElementById('instructions').style.display = 'block';
    $scope.remainingSeconds = (wait == true) ? $scope.secondsToWait : 0;
    $scope.lastPhoto = null; //TODO change to other method so that it removes photo from screen
  };

  var testSuccess = function(text) {
    $ionicLoading.hide();
    $ionicPopup.alert({
      title: "Votre image est correcte",
      template: text
    });
    initStripTest(true);
    $state.go('tabs.box');
  };

  var testFail = function(text) {
    $ionicLoading.hide();
    $ionicPopup.alert({
      title: "Erreur lors du traitement de l'image",
      template: text
    });
    initStripTest(false);
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
      document.getElementById('instructions').style.display = 'none';
      $timeout(function() {
        callback();
      }, 100, false);
    }, function(err) {
      console.err(err);
    }, {
      quality: 100,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.PNG,
      targetWidth: 768,
      targetHeight: 1024,
      saveToPhotoAlbum: false,
      correctOrientation: true
    });
  };

  var extractStrip = function(callback) {
    var imageObj = document.getElementById("imgCamera");
    var canvas   = document.getElementById("canvas");
    context      = canvas.getContext("2d");

    var imageData = Strip.getImageData(canvas, context, imageObj, ionic.Platform.isIOS());

    imageObj.style.display='none';

    QRCode.findQRPatterns(canvas, imageData, context,
      function(markers) {
        console.log('Enough markers: will crop now');

        var scaledImage = loadImage.scale(
          canvas, // img or canvas element
          {maxWidth: imageObj.width}
        );

        strip = Strip.computeCoordinates(markers);

        canvas.remove();

        //Draw the uploaded image on screen
        var canvas2 = document.getElementById("canvas2");
        context2 = canvas2.getContext("2d");

        canvas2.width  = strip.width;
        canvas2.height = strip.height;

        context2.drawImage(scaledImage, strip.x, strip.y, strip.width, strip.height, 0, 0, strip.width, strip.height);

        callback();
      },
      function() {
        testFail("l'image n'est pas lisible...");
      }
    );
  };

  var uploadAndRunAnalyze = function(successFct, errorFct) {
    canvas2 = document.getElementById("canvas2");

    var fileName = "raw_strip" + (new Date()).getTime() + ".png";

    if (canvas2.toBlob) {
      canvas2.toBlob(
        function (blob) {
          $cordovaFile.writeFile(cordova.file.cacheDirectory, fileName, blob, true)
            .then(function (success) {
              console.log("success");
              console.log(success);
              Uploader.upload(success.target.localURL, success.target.length, fileName)
                .then(function () {
                  console.log("Upload succeeded");
                  successFct();
                }, function () {
                  console.log("Upload failed");
                  errorFct();
                });
            }, function (error) {
              console.log('error writing file');
              console.log(error);
            });
        }
        , 'image/png'
      );
    };

  };

});