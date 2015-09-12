angular.module('risebox.controllers')

.controller('ChemistryNewCtrl', function($scope, $state, $stateParams, $timeout, $interval, $cordovaCamera, $cordovaFile, $ionicPopup, $ionicLoading,
                                         Uploader, ArCode) {
  $scope.secondsToWait = $scope.remainingSeconds = 3  ;

  $scope.testStrip = function() {
    countdown(function(){
      getPhoto(function(){
        detectArCode(function(){
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

  var findAndPrintQRPatterns = function(canvas, imageData, context) {
    qrcode.width=canvas.width;
    qrcode.height=canvas.height;
    qrcode.imagedata = imageData;
    var image = qrcode.grayScaleToBitmap(qrcode.grayscale());

    var finderPatternInfo = null
    try {
       finderPatternInfo = new FinderPatternFinder().findFinderPattern(image);
    }
    catch (e) {
      console.log('Not enough markers, please do it again !');
      testFail("l'image n'est pas lisible....");
      return null;
    }

    console.log('finderPatternInfo');
    console.log("topLeft x"+finderPatternInfo.topLeft.x+"y "+finderPatternInfo.topLeft.y);
    console.log("topRight x"+finderPatternInfo.topRight.x+"y "+finderPatternInfo.topRight.y);
    console.log("bottomLeft x"+finderPatternInfo.bottomLeft.x+"y "+finderPatternInfo.bottomLeft.y);

    context.strokeStyle = "green";
    context.strokeRect(finderPatternInfo.topLeft.x - 2, finderPatternInfo.topLeft.y - 2, 4, 4);

    context.strokeStyle = "blue";
    context.strokeRect(finderPatternInfo.topRight.x - 2, finderPatternInfo.topRight.y - 2, 4, 4);

    context.strokeStyle = "red";
    context.strokeRect(finderPatternInfo.bottomLeft.x - 2, finderPatternInfo.bottomLeft.y - 2, 4, 4);

    return { topLeft:    {x: finderPatternInfo.topLeft.x, y: finderPatternInfo.topLeft.y},
             topRight:   {x: finderPatternInfo.topRight.x, y: finderPatternInfo.topRight.y},
             bottomLeft: {x: finderPatternInfo.bottomLeft.x, y: finderPatternInfo.bottomLeft.y} };
  }

  var detectArCode = function(callback) {
    var imageObj = document.getElementById("imgCamera");
    var canvas=document.getElementById("canvas");
    context = canvas.getContext("2d");

    var imageData = null;

    if (ionic.Platform.isIOS()) {
      canvas.width  = imageObj.naturalHeight/2;
      canvas.height = imageObj.naturalWidth/2;

      context.translate(canvas.width, 0);
      context.rotate(0.5 * Math.PI);
      context.drawImage(imageObj, 0, 0, canvas.height, canvas.width);
      context.translate(0, canvas.width);
      context.rotate(-0.5 * Math.PI);
      imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    }
    else {
      canvas.width  = imageObj.naturalWidth/2;
      canvas.height = imageObj.naturalHeight/2;

      context.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
      imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    }

    var markers = findAndPrintQRPatterns(canvas, imageData, context);

    imageObj.style.display='none';

    if (markers.length < 3) {
      console.log('Not enough markers, please do it again !');
      testFail("l'image n'est pas lisible.");
    }
    else {
      console.log('Enough markers: will crop now');

      var transformedImg = loadImage.scale(
        canvas, // img or canvas element
        {maxWidth: imageObj.width}
      );

      // QRMarkers
      var markersHSpacing = markers.topRight.x - markers.topLeft.x;
      var markersVSpacing = markers.bottomLeft.y - markers.topLeft.y;

      var markerWidthRatio        = 0.06688963210702; // ex: 100 (marker width) / 1495 (markerHSpacing)
      var verticalBlankWidthRatio = 0.36454849498328; // ex: 545 (blank h width) / 1495 (markerHSpacing)
      var verticalExtraBlankRatio = 0.18069727891156; // ex: 425 (blank v width) / 2352 (markerVSpacing)

      var markerWidth        = markerWidthRatio * markersHSpacing;
      var verticalBlankWidth = verticalBlankWidthRatio * markersHSpacing;
      var verticalExtraBlank = verticalExtraBlankRatio * markersVSpacing;

      var stripX = markers.topLeft.x + (markerWidth/2) + verticalBlankWidth;
      var stripY = markers.topLeft.y - (markerWidth/2);
      var stripWidth = markersHSpacing - markerWidth - (verticalBlankWidth * 2);
      var stripHeight = markersVSpacing + markerWidth + verticalExtraBlank;

      //Common
      var sourceX = stripX;
      var sourceY = stripY;
      var sourceWidth  = stripWidth;
      var sourceHeight = stripHeight;
      var destX = 0;
      var destY = 0;
      var destWidth  = sourceWidth;
      var destHeight = sourceHeight;

      canvas.remove();

      //Draw the uploaded image on screen
      var canvas2 = document.getElementById("canvas2");
      context2 = canvas2.getContext("2d");

      canvas2.width  = destWidth;
      canvas2.height = destHeight;

      console.log('sourceX');
      console.log(sourceX);
      console.log('sourceY');
      console.log(sourceY);
      console.log('sourceWidth');
      console.log(sourceWidth);
      console.log('sourceHeight');
      console.log(sourceHeight);
      console.log('destX');
      console.log(destX);
      console.log('destY');
      console.log(destY);
      console.log('destWidth');
      console.log(destWidth);
      console.log('destHeight');
      console.log(destHeight);

      context2.drawImage(transformedImg, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
      callback();
    }
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