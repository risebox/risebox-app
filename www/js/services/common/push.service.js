angular.module('risebox.services')

.factory('Push', function($cordovaPush, $ionicPopup, $state) {

  var notificationReceived = function(message){
    console.log('Push Notification received');
    console.log(message);
    switch (ionic.Platform.platform()) {
      case 'ios':
        console.log('Received IOS Notification');
        onNotificationAPN(message);
      break;
      case 'android':
        if (message.event == 'message') {
          console.log('Received Android Notification');
          onNotification(message);
        } else {
          console.log("Message " + message.event + " received : won't do anything, Ionic Push will call webhook");
        }
      break;
    }
  }

  var onNotificationAPN = function (e) {
    if (e.alert) {
      // showing an alert also requires the org.apache.cordova.dialogs plugin
      navigator.notification.alert(e.alert);
    }

    if (e.sound) {
      // playing a sound also requires the org.apache.cordova.media plugin
      var snd = new Media(e.sound);
      snd.play();
    }

    if (e.badge) {
      $cordovaPush.setBadgeNumber(e.badge).then(function(result) {
          console.log('Success !!');
        }, function(err) {
          console.log('An error occured');
        });
    }

    handleNotification(e.foreground, "RiseboxApp", e.body, e.$state, e.$stateParams);
  }

  // handle GCM notifications for Android
  var onNotification = function (e) {
    this.eventReceived = e;
    switch( e.event ) {
      // case 'registered':
      //   if ( e.regid.length > 0 ) {
      //     // this.storeTokenOnServer(e.regid);
      //     // Your GCM push server needs to know the regID before it can push to this device
      //     // here is where you might want to send it the regID for later use.
      //   }
      //   break;
      case 'message':
        // if this flag is set, this notification happened while we were in the foreground.
        // you might want to play a sound to get the user's attention, throw up a dialog, etc.
        if (e.foreground) {
          // alert('INLINE NOTIFICATION');
          handleNotification(e.foreground, e.payload.title, e.payload.message, e.payload.payload.$state, e.payload.payload.$stateParams);
          // if the notification contains a soundname, play it. playing a sound also requires the org.apache.cordova.media plugin
          var my_media = new Media("/android_asset/www/"+ e.soundname);
          my_media.play();
        }
        else { // otherwise we were launched because the user touched a notification in the notification tray.
          handleNotification(e.foreground, e.payload.title, e.payload.message, e.payload.payload.$state, e.payload.payload.$stateParams);
          // if (e.coldstart)
            // alert('COLDSTART NOTIFICATION');
          // else
            // alert('BACKGROUND NOTIFICATION');
        }
        // alert('MSG: '+e.payload.collapseKey);
        break;

      case 'error':
        alert('ERROR MSG: '+ e.msg + 'MSGCNT ' + e.payload.msgcnt);
        break;

      default:
        alert('EVENT Unknown, an event was received and we do not know what it is');
        break;
    }
  }

  var handleNotification = function (isForeground, alertTitle, alertMessage, state, params) {
    if (!isForeground){
      $ionicPopup.alert({
        title: alertTitle,
        template: alertMessage
      });
    }

    $state.go(state, JSON.parse(params));
  }

  return {
    notificationReceived: notificationReceived
  }

})

;