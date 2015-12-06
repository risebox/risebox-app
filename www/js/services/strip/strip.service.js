angular.module('risebox.services')

.factory('Strip', function() {

  var markerWidthRatio        = 0.1344894595; // ex: 100 (marker width) / 1495 (markerHSpacing)
  var verticalBlankWidthRatio = 0.36454849498328; // ex: 545 (blank h width) / 1495 (markerHSpacing)
  var verticalExtraBlankRatio = 0.18069727891156; // ex: 425 (blank v width) / 2352 (markerVSpacing)

  var _strip = null

  var getImageData = function (canvas, context, imageObj, turnImage) {
    if (turnImage == true) {
      canvas.width  = imageObj.naturalHeight/2;
      canvas.height = imageObj.naturalWidth/2;

      context.translate(canvas.width, 0);
      context.rotate(0.5 * Math.PI);
      context.drawImage(imageObj, 0, 0, canvas.height, canvas.width);
      context.translate(0, canvas.width);
      context.rotate(-0.5 * Math.PI);
      return context.getImageData(0, 0, canvas.width, canvas.height);
    }
    else {
      canvas.width  = imageObj.naturalWidth/2;
      canvas.height = imageObj.naturalHeight/2;

      context.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
      return context.getImageData(0, 0, canvas.width, canvas.height);
    }
  }

  var computeCoordinates = function (markers) {
    console.log('markers');
    console.log(markers);

    var markersHSpacing = markers.topRight.x - markers.topLeft.x;
    var markersVSpacing = markers.bottomLeft.y - markers.topLeft.y;

    var markerWidth        = markerWidthRatio * markersHSpacing;
    var verticalBlankWidth = verticalBlankWidthRatio * markersHSpacing;
    var verticalExtraBlank = verticalExtraBlankRatio * markersVSpacing;

    console.log('markerWidth');
    console.log(markerWidth);
    console.log('verticalBlankWidth');
    console.log(verticalBlankWidth);
    console.log('verticalExtraBlank');
    console.log(verticalExtraBlank);

    var stripX = markers.topLeft.x + (markerWidth/2) + verticalBlankWidth;
    var stripY = markers.topLeft.y - (markerWidth/2);
    var stripWidth = markersHSpacing - markerWidth - (verticalBlankWidth * 2);
    var stripHeight = markersVSpacing + markerWidth + verticalExtraBlank;

    console.log('stripX');
    console.log(stripX);
    console.log('stripY');
    console.log(stripY);
    console.log('stripWidth');
    console.log(stripWidth);
    console.log('stripHeight');
    console.log(stripHeight);

    _strip = {x: stripX, y: stripY, width: stripWidth, height: stripHeight};
    return _strip;
  }

  return {
    getImageData:       getImageData,
    computeCoordinates :computeCoordinates
  }

});