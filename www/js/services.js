angular.module('risebox.services', [])

.factory('Api', function($http, $q, ApiEndpoint) {
  console.log('ApiEndpoint', ApiEndpoint)

  var config = {
    headers: {
      "RISEBOX-SECRET": '4dee01d78a2800a378c8d63afc41fc9b'
    }
  };

  var getApiData = function() {
    var q = $q.defer();

    $http.get(ApiEndpoint.url)
    .success(function(data) {
      console.log('Got some data: ', data)
      q.resolve(data);
    })
    .error(function(error){
      console.log('Had an error')
      q.reject(error);
    })

    return q.promise;
  }

  var getSignature = function(params) {
    var q = $q.defer();

    $http.post(ApiEndpoint.url + '/sign', params)
    .success(function(data) {
      console.log('Posted some data: ', data)
      q.resolve(data);
    })
    .error(function(error){
      console.log('Had an error on POST')
      q.reject(error);
    })

    return q.promise;
  }

  var analyzeStrip = function(params) {
    var q = $q.defer();

    console.log('params');
    console.log(params);

    $http({
        method: "post",
        url: ApiEndpoint.url + '/api/devices/lab1/strips',
        headers: {
          "RISEBOX-SECRET": 'token2'
        },
        data: params
    })
    .success(function(data) {
      console.log('Posted some data: ', data)
      q.resolve(data);
    })
    .error(function(error){
      console.log('Had an error on POST')
      q.reject(error);
    })

    return q.promise;
  }

  return {
    getApiData:  getApiData,
    getSignature: getSignature,
    analyzeStrip: analyzeStrip
  };
})

.factory('Uploader', function($ionicPlatform, $cordovaFileTransfer, Api) {

  var upload = function (imageURI, fileName) {
    var options = {
      "fileKey": "file",
      "fileName": fileName,
      "mimeType": "image/jpeg",
      "chunkedMode": false
    };

    console.log("Api");
    console.log(Api);

    Api.getSignature({"file_name": fileName})
        .then(function(sigResult) {
          options.params = {
            "acl": "public-read",
            "bucket": sigResult.bucket,
            "Content-Type": "image/jpeg",
            "key": fileName,
            "AWSAccessKeyId": sigResult.access_key,
            "policy": sigResult.policy,
            "signature": sigResult.signature
          };
          $ionicPlatform.ready(function() {
            console.log("FileTransfer uploader");
            console.log(FileTransfer);
            console.log("options");
            console.log(options);

            $cordovaFileTransfer
              .upload("https:" + sigResult.url, imageURI, options)
              .then(function(uploadResult) {
                console.log('upload complete');
                console.log(uploadResult);

                Api.analyzeStrip({"model": "JBL EasyTest 6in1", "upload_key": fileName})
                  .then(function(analyze) {
                    console.log('analyze in progress you will be notified');
                    console.log(analyze);
                  }, function(err) {
                    console.log('analyze failed');
                    console.log(err);
                  })

              }, function(err) {
                console.log('upload failed');
                console.log(err);
              }, function (progress) {
                console.log('upload in progress');
                console.log(progress);
              });
          });
        });
  }

  return {
      upload: upload
  }

})

.factory('ArCode', function() {
  return {
     drawCorners: function(markers, context){
      var corners, corner, i, j;

      context.lineWidth = 3;

      for (i = 0; i !== markers.length; ++ i){
        corners = markers[i].corners;

        context.strokeStyle = "red";
        context.beginPath();

        for (j = 0; j !== corners.length; ++ j){
          corner = corners[j];
          context.moveTo(corner.x, corner.y);
          corner = corners[(j + 1) % corners.length];
          context.lineTo(corner.x, corner.y);
        }

        context.stroke();
        context.closePath();

        context.strokeStyle = "green";
        context.strokeRect(corners[0].x - 2, corners[0].y - 2, 4, 4);
      }
    },
    drawId: function(markers, context){
      var corners, corner, x, y, i, j;

      context.strokeStyle = "blue";
      context.lineWidth = 1;

      for (i = 0; i !== markers.length; ++ i){
        corners = markers[i].corners;

        x = Infinity;
        y = Infinity;

        for (j = 0; j !== corners.length; ++ j){
          corner = corners[j];

          x = Math.min(x, corner.x);
          y = Math.min(y, corner.y);
        }

        context.strokeText(markers[i].id, x, y)
      }
    },
    getMarkerCorners: function(markers, context){
      var newMarker = {};
      for (var i = 0; i < markers.length; i++) {
        console.log('computing marker');
        console.log(i);

        marker = markers[i];
        var sum = minSum = maxSum = 0;
        var sumArray = {};
        for (var j = 0; j < marker.corners.length; j++) {
          sum = marker.corners[j].x + marker.corners[j].y;
          sumArray[sum] = j;
        }

        minSum = Math.min.apply(Math, Object.keys(sumArray));
        maxSum = Math.max.apply(Math, Object.keys(sumArray));


        var ulId = urId = llId = lrId = 0;
        ulId = sumArray[minSum];
        lrId = sumArray[maxSum];

        var othersX = {};
        var cpt = 0;
        for (var j2 = 0; j2 < marker.corners.length; j2++) {
          if (j2 != ulId && j2 != lrId) {
            othersX[cpt] = {};
            othersX[cpt][j2] = marker.corners[j2].x;
            cpt++;
          }
        }

        if (othersX[0].value < othersX[1].value ) {
          llId = Object.keys(othersX[0]);
          urId = Object.keys(othersX[1]);
        }
        else{
          llId = Object.keys(othersX[1]);
          urId = Object.keys(othersX[0]);
        }

        newMarker[marker.id] = {'ul': marker.corners[ulId], 'ur': marker.corners[urId],
                                'll': marker.corners[llId], 'lr': marker.corners[lrId]}

        context.strokeStyle = "yellow";

        context.strokeText('ul', newMarker[marker.id]['ul'].x, newMarker[marker.id]['ul'].y);
        context.strokeText('ur', newMarker[marker.id]['ur'].x, newMarker[marker.id]['ur'].y);
        context.strokeText('ll', newMarker[marker.id]['ll'].x, newMarker[marker.id]['ll'].y);
        context.strokeText('lr', newMarker[marker.id]['lr'].x, newMarker[marker.id]['lr'].y);
      }
      return newMarker;
    }
  }
});