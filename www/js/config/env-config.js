angular.module('risebox.config')

.constant('EnvConfig', {
  RISEBOX_API_ENDPOINT: { url: 'https://risebox-api.herokuapp.com' },
  IONIC_DEPLOY_CHANNEL: 'production',
  STRIP_WAITING_TIME: '60'
})

;