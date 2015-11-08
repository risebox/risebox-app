angular.module('risebox.controllers')

.controller('ChemistryShowCtrl', function($scope, $stateParams, RiseboxApi, RiseboxObj) {
    var doneFct = function(result){
      $scope.strip = result.result;
    }

    var failFct = function(err){
      console.log("Désolé impossible de récupérer vos résultats")
    }

    RiseboxApi.getStripResults(RiseboxObj.getToken(),
                               RiseboxObj.getInfo().devices[0].key,
                               $stateParams.strip_id,
                               $stateParams)
                  .then(function(result) {
                    doneFct(result);
                  }, function(err) {
                    failFct(err);
                  });
})

;