angular.module('risebox.controllers')

.controller('LightStatusCtrl', function($ionicPopup, $scope, Light) {

    var configRetrievalSuccess = function(result){
      $scope.light = result;
      $scope.sunrisePickerObject.inputEpochTime = $scope.light['sunrise']['hours'] * 60 * 60 + $scope.light['sunrise']['minutes'] * 60;
      $scope.sunsetPickerObject.inputEpochTime = $scope.light['sunset']['hours'] * 60 * 60 + $scope.light['sunset']['minutes'] * 60;
    }

    var configRetrievalError = function(err){
      console.log("Désolé impossible de récupérer la configuration résultats")
    }

    var setLightSchedule = function(evt, val) {
      if (typeof (val) === 'undefined') {
        console.log('Time not selected');
      } else {
        var selectedTime = new Date(val * 1000);
        console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');

        Light.setSchedule(evt, selectedTime.getUTCHours(), selectedTime.getUTCMinutes()).then(function() {
          console.log("Evènement " + evt + " mis à jour");
          $scope.getLightConfig();
        }, function(err) {
          $ionicPopup.alert({
            title: "Programmation inchangée",
            template: "La mise à jour du planning jour / nuit. Retentez plus tard."
          });
        });
      }
    }

    $scope.getLightConfig = function(){
      Light.getConfig()
          .then(function(result) {
            configRetrievalSuccess(result);
          }, function(err) {
            configRetrievalError(err);
          });
    }

    $scope.setLightRecipe = function(level, recipe){
      Light.setRecipe(level, recipe).then(function() {
            console.log("Lumière " + level + " mise à jour en " + recipe);
            $scope.getLightConfig();
          }, function(err) {
            $ionicPopup.alert({
              title: "Eclairage inchangé",
              template: "La mise à jour de la couleur n'a pas fonctionné. Retentez plus tard."
            });
          });
    }

    $scope.sunrisePickerObject = {
      inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
      step: 15,  //Optional
      format: 24,  //Optional
      titleLabel: 'Levé du soleil',  //Optional
      setLabel: 'OK',  //Optional
      closeLabel: 'Fermer',  //Optional
      setButtonType: 'button-royal',  //Optional
      closeButtonType: 'button-stable',  //Optional
      callback: function (val) {    //Mandatory
        setLightSchedule("sunrise", val);
      }
    };

    $scope.sunsetPickerObject = {
      inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
      step: 15,  //Optional
      format: 24,  //Optional
      titleLabel: 'Couché du soleil',  //Optional
      setLabel: 'OK',  //Optional
      closeLabel: 'Fermer',  //Optional
      setButtonType: 'button-royal',  //Optional
      closeButtonType: 'button-stable',  //Optional
      callback: function (val) {    //Mandatory
        setLightSchedule("sunset", val);
      }
    };

    //Run when controllers starts
    $scope.getLightConfig();

    $scope.headerSpace = (ionic.Platform.isIOS() === true ? 'big' : 'small');
})

;