angular.module('risebox.services')

.factory('Uploader', function($q, $ionicPlatform, $cordovaFileTransfer, RiseboxApi, RiseboxObj) {

  var upload = function (imageURI, imageSize, fileName) {
    var q = $q.defer();
    var options = {
      "fileKey": "file",
      "fileName": fileName,
      "mimeType": "image/png",
      "chunkedMode": true
    };

    RiseboxApi.getUploadSignature({"file_name": fileName})
      .then(function(sigResult) {
        options.params = {
          "acl": "public-read",
          "bucket": sigResult.bucket,
          "Content-Type": "image/png",
          "Content-Length": imageSize,
          "key": fileName,
          "AWSAccessKeyId": sigResult.access_key,
          "policy": sigResult.policy,
          "signature": sigResult.signature
        };
        options.headers = {
          "Content-Length": imageSize
        };
        $ionicPlatform.ready(function() {
          $cordovaFileTransfer.upload("https:" + sigResult.url, imageURI, options)
            .then(function(uploadResult) {
              RiseboxApi.analyzeStrip(RiseboxObj.getToken(),
                                      RiseboxObj.getInfo().devices[0].key,
                                      {"model": "JBL EasyTest 6in1", "upload_key": fileName, "tested_at": new Date()})
                .then(function(analyze) {
                  console.log('done Analyzing strip ' + JSON.stringify(analyze));
                  q.resolve();
                }, function(err) {
                  console.log('err Analyzing strip ' + JSON.stringify(err));
                  q.reject(err);
                })
            }, function(err) {
              console.log('err Uploading strip ' + JSON.stringify(err));
              q.reject(err);
            }, function (progress) {
              console.log('upload in progress ' + JSON.stringify(progress));
            });
        });
      });

      return q.promise;
  }

  return {
      upload: upload
  }

});