angular.module('risebox.services')

.factory('QRCode', function() {
  var _markers = { topLeft:    {x: null, y: null},
                   topRight:   {x: null, y: null},
                   bottomLeft: {x: null, y: null}  };

  var markers = function() {
    return _markers;
  }

  var setMarkers = function(finderPatternInfo) {
    _markers = { topLeft:    {x: finderPatternInfo.topLeft.x, y: finderPatternInfo.topLeft.y},
                 topRight:   {x: finderPatternInfo.topRight.x, y: finderPatternInfo.topRight.y},
                 bottomLeft: {x: finderPatternInfo.bottomLeft.x, y: finderPatternInfo.bottomLeft.y} };
  }

  var findQRPatterns = function(canvas, imageData, context, successCB, errorCB) {
    qrcode.width=canvas.width;
    qrcode.height=canvas.height;
    qrcode.imagedata = imageData;
    var image = qrcode.grayScaleToBitmap(qrcode.grayscale());

    var finderPatternInfo = null

    try {
       finderPatternInfo = new FinderPatternFinder().findFinderPattern(image);
    }
    catch (e) {
      console.log("Impossible de lire l'image !");
      errorCB();
      return;
    }

    setMarkers(finderPatternInfo);

    showQRMarkers();

    ensureMarkersAreCorrect(successCB, errorCB);
  }

  var ensureMarkersAreCorrect = function(successCB, errorCB) {
    if ( _markers.topLeft.x > 0 && _markers.topLeft.y > 0  &&
         _markers.topRight.x > 0 && _markers.topRight.y > 0  &&
         _markers.bottomLeft.x > 0 && _markers.bottomLeft.y > 0  ) {
      successCB(_markers);
    }
    else {
      errorCB();
    }
  }

  var showQRMarkers = function() {
    console.log('_markers');

    console.log("topLeft x "+_markers.topLeft.x+" y "+_markers.topLeft.y);
    console.log("topRight x "+_markers.topRight.x+" y "+_markers.topRight.y);
    console.log("bottomLeft x "+_markers.bottomLeft.x+" y "+_markers.bottomLeft.y);

    context.strokeStyle = "green";
    context.strokeRect(_markers.topLeft.x - 2, _markers.topLeft.y - 2, 4, 4);

    context.strokeStyle = "blue";
    context.strokeRect(_markers.topRight.x - 2, _markers.topRight.y - 2, 4, 4);

    context.strokeStyle = "red";
    context.strokeRect(_markers.bottomLeft.x - 2, _markers.bottomLeft.y - 2, 4, 4);
  }

  return {
    findQRPatterns: findQRPatterns,
    markers: markers
  }

});