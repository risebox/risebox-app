angular.module('risebox.controllers')

.controller('ChemistryShowCtrl', function($scope, $stateParams, RiseboxApi, RiseboxObj) {
    var doneFct = function(result){
      $scope.strip = result.result;
    }

    var failFct = function(err){
      console.log("Désolé impossible de récupérer vos résultats")
    }

    RiseboxApi.getStripResults(RiseboxObj.getInfo().device.key,
                               RiseboxObj.getInfo().device.token,
                               $stateParams.strip_id,
                               $stateParams)
                  .then(function(result) {
                    doneFct(result);
                  }, function(err) {
                    failFct(err);
                  });
})

;