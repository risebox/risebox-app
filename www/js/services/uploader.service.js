angular.module('risebox.services')

.factory('Uploader', function($ionicPlatform, $cordovaFileTransfer, RiseboxApi, RiseboxObj) {

  var upload = function (imageURI, imageSize, fileName, doneFct, failFct) {
    var options = {
      "fileKey": "file",
      "fileName": fileName,
      "mimeType": "image/jpeg",
      "chunkedMode": true
    };

    RiseboxApi.getUploadSignature({"file_name": fileName})
        .then(function(sigResult) {
          options.params = {
            "acl": "public-read",
            "bucket": sigResult.bucket,
            "Content-Type": "image/jpeg",
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
            $cordovaFileTransfer
              .upload("https:" + sigResult.url, imageURI, options)
              .then(function(uploadResult) {
                RiseboxApi.analyzeStrip(RiseboxObj.getInfo().device.key,
                                        RiseboxObj.getInfo().device.token,
                                        {"model": "JBL EasyTest 6in1", "upload_key": fileName})
                  .then(function(analyze) {
                    console.log('done Analyzing strip ' + JSON.stringify(analyze));
                    doneFct();
                  }, function(err) {
                    console.log('err Analyzing strip ' + JSON.stringify(err));
                    failFct();
                  })
              }, function(err) {
                console.log('err Uploading strip ' + JSON.stringify(err));
                failFct();
              }, function (progress) {
                console.log('upload in progress ' + JSON.stringify(progress));
              });
          });
        });
  }

  return {
      upload: upload
  }

});