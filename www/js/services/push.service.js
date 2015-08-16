angular.module('risebox.services')

.factory('Push', function($cordovaPush, $ionicPopup, $state) {

  var notificationReceived = function(message){
    if (message.event == 'message') {
      if (message.collapse_key != null) {
        console.log('Received Android Notification');
        onNotification(message);
      } else {
        console.log('Received Apple Notification');
        onNotificationAPN(message);
      }
    } else {
      console.log("Message" + message.event + "received : won't do anything, Ionic Push will call webhook");
    }
  }

  var onNotificationAPN = function (e) {
    if (e.alert) {
      // showing an alert also requires the org.apache.cordova.dialogs plugin
      // navigator.notification.alert(e.alert);
      handleNotification(e);
    }

    if (e.sound) {
      // playing a sound also requires the org.apache.cordova.media plugin
      var snd = new Media(e.sound);
      snd.play();
    }

    if (e.badge) {
      pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
    }
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
          handleNotification(e);
          // if the notification contains a soundname, play it. playing a sound also requires the org.apache.cordova.media plugin
          var my_media = new Media("/android_asset/www/"+ e.soundname);
          my_media.play();
        }
        else { // otherwise we were launched because the user touched a notification in the notification tray.
          handleNotification(e);
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

  var handleNotification = function (e) {
    console.log('=> handleNotification');

    console.log('stateParams');
    console.log(e.payload.payload.$stateParams);

    if (!e.foreground){
      $ionicPopup.alert({
        title: e.payload.title,
        template: e.payload.message
      });
    }

    console.log("moving to "+e.payload.payload.$state);
    console.log('JSON.parse(e.payload.payload.$stateParams)');
    console.log(JSON.parse(e.payload.payload.$stateParams));
    $state.go(e.payload.payload.$state, JSON.parse(e.payload.payload.$stateParams));
  }

  return {
    notificationReceived: notificationReceived
  }

})

;