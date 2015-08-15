angular.module('risebox.services')

.factory('Push', function($cordovaPush) {

  var notificationReceived = function(message){
    if (message.collapse_key != null) {
      console.log('Received Android Notification');
      onNotification(message);
    } else {
      console.log('Received Apple Notification');
      onNotificationAPN(message);
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
      pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
    }
  }

  // handle GCM notifications for Android
  var onNotification = function (e) {
    this.eventReceived = e;
    // alert("event received" + JSON.stringify(e))
    switch( e.event ) {
      case 'registered':
        if ( e.regid.length > 0 ) {
          this.storeTokenOnServer(e.regid);
          // Your GCM push server needs to know the regID before it can push to this device
          // here is where you might want to send it the regID for later use.
        }
        break;

      case 'message':
        // if this flag is set, this notification happened while we were in the foreground.
        // you might want to play a sound to get the user's attention, throw up a dialog, etc.
        if (e.foreground) {
          alert('INLINE NOTIFICATION');
          // if the notification contains a soundname, play it. playing a sound also requires the org.apache.cordova.media plugin
          var my_media = new Media("/android_asset/www/"+ e.soundname);
          my_media.play();
        }
        else { // otherwise we were launched because the user touched a notification in the notification tray.
          if (e.coldstart)
            alert('COLDSTART NOTIFICATION');
          else
            alert('BACKGROUND NOTIFICATION');
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

  return {
    notificationReceived: notificationReceived
  }

})

;