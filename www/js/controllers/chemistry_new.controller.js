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
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.PNG,
      targetWidth: 768,
      targetHeight: 1024,
      saveToPhotoAlbum: false,
      correctOrientation: true
    });
  };

  // var detectArCode = function(callback) {
  //   var orientation = null

  //   if (ionic.Platform.isIOS()) {
  //     console.log("iOS & Portrait => Rotate image");
  //     orientation = 6;
  //   } else {
  //     console.log("Android Portrait => no change in image");
  //     orientation = 1;
  //   }

  //   loadImage(
  //     $scope.lastPhoto,
  //     function (canvas) {
  //       var imageObj = document.getElementById("imgCamera");

  //       document.getElementById('canvasContainer').appendChild(canvas);
  //       context = canvas.getContext("2d");

  //       console.log('Orientation is ' + JSON.stringify(screen.orientation));

  //       if (ionic.Platform.isIOS()) {
  //         console.log("iOS & Portrait => let\'s turn back");
  //         //We know you are in portrait as we forced it
  //         //=> Rotate back to normal orientation
  //         context.rotate(-0.5 * Math.PI);
  //         context.translate(-canvas.width, 0);
  //       }

  //       detector = new AR.Detector();

  //       imageData = context.getImageData(0, 0, canvas.width, canvas.height);

  //       var markers = detector.detect(imageData);

  //       ArCode.drawCorners(markers, context);
  //       ArCode.drawId(markers, context);

  //       if (markers.length < 4) {
  //         console.log('Not enough markers, please do it again !');
  //         testFail("l'image n'est pas lisible....");
  //       }
  //       else {
  //         console.log('Enough markers: will crop now');

  //         var newMarkers = ArCode.getMarkerCorners(markers, context);
  //         var transformedImg = new Image();

  //         transformedImg.onload = function(){   // put this above img.src = …
  //           transformedImg.width = imageObj.width;
  //           transformedImg.height = imageObj.height;

  //           var pixelsFromULCornerToStrip = 45;
  //           var pixelsBelowBottomCorner = 23;

  //           var sourceX = newMarkers[1]['ur'].x + pixelsFromULCornerToStrip;
  //           var sourceY = newMarkers[1]['ur'].y;
  //           var sourceWidth  = (newMarkers[68]['ul'].x - newMarkers[1]['ur'].x) - (pixelsFromULCornerToStrip *2);
  //           var sourceHeight = (newMarkers[0]['lr'].y - newMarkers[1]['ur'].y) + pixelsBelowBottomCorner;
  //           var destX = 0;
  //           var destY = 0;
  //           var destWidth  = sourceWidth;
  //           var destHeight = sourceHeight;

  //           imageObj.remove();
  //           canvas.remove();

  //           //Draw the uploaded image on screen
  //           var canvas2 = document.getElementById("canvas2");
  //           context2 = canvas2.getContext("2d");

  //           canvas2.width  = destWidth;
  //           canvas2.height = destHeight;

  //           console.log('sourceX');
  //           console.log(sourceX);
  //           console.log('sourceY');
  //           console.log(sourceY);
  //           console.log('sourceWidth');
  //           console.log(sourceWidth);
  //           console.log('sourceHeight');
  //           console.log(sourceHeight);
  //           console.log('destX');
  //           console.log(destX);
  //           console.log('destY');
  //           console.log(destY);
  //           console.log('destWidth');
  //           console.log(destWidth);
  //           console.log('destHeight');
  //           console.log(destHeight);

  //           context2.drawImage(transformedImg, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);

  //           callback();
  //         };
  //         transformedImg.src = canvas.toDataURL("image/png");
  //       }
  //     },
  //     {
  //       orientation: orientation,
  //       maxWidth: 768,
  //       maxHeight: 1024,
  //       canvas: true
  //     } // Options
  //   );
  // };

  var detectArCode = function(callback) {
    var imageObj = document.getElementById("imgCamera");
    var canvas=document.getElementById("canvas");
    context = canvas.getContext("2d");

    canvas.width = parseInt(imageObj.width*1000/imageObj.height);
    canvas.height = 1000;

    var imageData = null;

    if (ionic.Platform.isIOS()) {
      context.translate(canvas.width, 0);
      context.rotate(0.5 * Math.PI);
      context.drawImage(imageObj, 0, 0, canvas.height, canvas.width);
      context.translate(0, canvas.width);
      context.rotate(-0.5 * Math.PI);
      imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    }
    else {
      context.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
      imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    }

    detector = new AR.Detector();

    var markers = detector.detect(imageData);

    imageObj.style.display='none';
    ArCode.drawCorners(markers, context);
    ArCode.drawId(markers, context);

    if (markers.length < 4) {
      console.log('Not enough markers, please do it again !');
      testFail("l'image n'est pas lisible.");
    }
    else {
      console.log('Enough markers: will crop now');

      var newMarkers = ArCode.getMarkerCorners(markers, context);

      // var transformedImg = new Image();

      var transformedImg = loadImage.scale(
        canvas, // img or canvas element
        {maxWidth: imageObj.width}
      );

      // transformedImg.onload = function(){   // put this above img.src = …
        // transformedImg.width = imageObj.width;
        // transformedImg.height = imageObj.height;

        if (newMarkers[68] == null || newMarkers[0] == null || newMarkers[1] == null) {
          testFail("L'image n'est pas reconnue.");
          return;
        }

        // var pixelsFromULCornerToStrip = 45;
        // var pixelsBelowBottomCorner = 23;
        var cardWidth = newMarkers[68]['ul'].x - newMarkers[1]['ur'].x;
        var cardHeight = newMarkers[0]['lr'].y - newMarkers[1]['ur'].y;

        var blankWidthRatio = 0.25;
        var extraHeightRatio = 0.14469453376206;

        var blankWidth = blankWidthRatio * cardWidth
        var extraHeight = extraHeightRatio * cardHeight

        var stripX = newMarkers[1]['ur'].x + blankWidth;
        var stripY = newMarkers[1]['ur'].y;

        var stripWidth = cardWidth - (blankWidth *2);
        var stripHeight = cardHeight + extraHeight;

        var sourceX = stripX;
        var sourceY = stripY;
        var sourceWidth  = stripWidth;
        var sourceHeight = stripHeight;
        var destX = 0;
        var destY = 0;
        var destWidth  = sourceWidth;
        var destHeight = sourceHeight;

        // var pixelsFromULCornerToStrip = 23
        // var pixelsBelowBottomCorner = 45

        // var sourceX = newMarkers[1]['ur'].x + pixelsFromULCornerToStrip;
        // var sourceY = newMarkers[1]['ur'].y;
        // var sourceWidth  = (newMarkers[68]['ul'].x - newMarkers[1]['ur'].x) - (pixelsFromULCornerToStrip *2);
        // var sourceHeight = (newMarkers[0]['lr'].y - newMarkers[1]['ur'].y) + pixelsBelowBottomCorner;
        // var destX = 0;
        // var destY = 0;
        // var destWidth  = sourceWidth;
        // var destHeight = sourceHeight;

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
        imageObj.style.display='block';
        callback();
      // };
      // transformedImg.src = canvas.toDataURL("image/png");
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