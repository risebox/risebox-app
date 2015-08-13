angular.module('risebox.services')

.factory('Ionic', function($rootScope, $ionicUser, $ionicPush, RiseboxObj) {

  var identifyUser = function(extra_metadata) {
    console.log('Ionic User: Identifying with Ionic User service');
    var user = $ionicUser.get();
    if(!user.user_id) {
      // Set your user_id here, or generate a random one.
      user.user_id = $ionicUser.generateGUID();
    };

    // Add some metadata to your user object.
    angular.extend(user, extra_metadata);

    // Identify your user with the Ionic User Service
    $ionicUser.identify(user).then(function(){
      RiseboxObj.setIonicUserId(user.user_id);
      console.log('Ionic Identified user ' + user.first_name + '\n ID ' + user.user_id);
    });
  }

  // Registers a device for push notifications and stores its token
  var pushRegister = function() {
    console.log('Ionic Push: Registering user');
    // Register with the Ionic Push service.  All parameters are optional.
    $ionicPush.register({
      canShowAlert: true, //Can pushes show an alert on your screen?
      canSetBadge: true, //Can pushes update app icon badges?
      canPlaySound: true, //Can notifications play a sound?
      canRunActionsOnWake: true, //Can run actions outside the app,
      onNotification: function(notification) {
        console.log('notification');
        console.log(notification);
        return true;
      }
    }).then(function(){
      console.log('$ionicPush.register');
      console.log($ionicPush.register);
    });
  }

  return {
    identifyUser: identifyUser,
    pushRegister: pushRegister
  }
})

;