import { createActions } from 'redux-feline-actions'

export default ({
  dataFields = {},
  urls = {},
  serverUrl
}) => createActions({
  init: {
    use: 'storage',
    data: {
      ...dataFields, 
      token: true
    }
  },

  logIn: data => ({
    use: 'request',
    method: 'POST',
    url: urls.login || `${serverUrl}login`,
    data
  }),

  logOff: true,

  resetIsJustRegistered: true,

  register: data => ({
    use: 'request',
    method: 'POST',
    url: urls.register || `${serverUrl}register`,
    data
  }),

  locate: data => ({
    use: 'request',
    method: 'PUT',
    url: urls.locate || `${serverUrl}locate`,
    data
  }),

  updateProfile: data => ({
    use: 'request',
    method: 'PUT',
    url: urls.profile || `${serverUrl}profile`,
    data
  }),

  uploadProfileImage: image => ({
    use: 'request',
    method: 'POST',
    url: urls.upload || `${serverUrl}upload/image`,
    sendAsForm: true,
    reportProgress: true,
    data: {
      ...image,
      role: 'avatar', 
      target: 'user',
      crop: JSON.stringify({x: 0, y: 0, width: 1, height: 1})
    }
  })
}, {
  prefix: 'session'
})
