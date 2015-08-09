angular.module('risebox.services')

.factory('Uploader', function($ionicPlatform, $cordovaFileTransfer, RiseboxApi) {

  var upload = function (imageURI, fileName, doneFct, failFct) {
    var options = {
      "fileKey": "file",
      "fileName": fileName,
      "mimeType": "image/jpeg",
      "chunkedMode": false
    };

    RiseboxApi.getUploadSignature({"file_name": fileName})
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
            $cordovaFileTransfer
              .upload("https:" + sigResult.url, imageURI, options)
              .then(function(uploadResult) {
                RiseboxApi.analyzeStrip({"model": "JBL EasyTest 6in1", "upload_key": fileName})
                  .then(function(analyze) {
                    doneFct();
                  }, function(err) {
                    failFct();
                  })

              }, function(err) {
                failFct();
              }, function (progress) {

              });
          });
        });
  }

  return {
      upload: upload
  }

});