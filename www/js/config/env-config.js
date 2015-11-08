angular.module('risebox.config')

.constant('EnvConfig', {
  RISEBOX_API_ENDPOINT: { url: 'https://rbdev-api.herokuapp.com' },
  IONIC_DEPLOY_CHANNEL: 'dev',
  STRIP_WAITING_TIME: '3'
})

;