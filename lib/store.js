import Immutable, { Map, List } from 'immutable';

import createAsyncStores from 'cat-stores';

import {
  storageGet,
  storageSet,
  storageRemove
} from 'cat-box';

export default (dataFields, options = {}) => {

  let token = null;

  try {
    token = localStorage.token;
  } catch (e) {}

  const initialState = Immutable.fromJS({    
    initializing: true,
    loggedIn: false,
    loggingIn: token != null,
    token,
    uploadProgress: 0,
    isUploadingProfileImage: false,
    isJustRegistered: false,
    ...dataFields
  });

  const createUserDataHandler = ({ justRegistered = false } = {}) => ({
    begin: (state, action) => state 
      .set('loggingIn', true)
      .delete('error'),
    complete: (state, {payload}) => {

      if (Array.isArray(options.roles)) {
        if (options.roles.indexOf(payload.role) === -1) {
          return state
            .set('error', 'loginErrorInsufficientRights')
            .set('loggingIn', false)
        }
      }

      const f = Object.keys({
        token: null,
        ...dataFields
      })
      const userData = f.reduce((p, key) => payload[key] != null ? ({
          ...p,
          [key]: payload[key]
        }) : p, {});

      storageSet(userData);

      return Object.keys(userData)
        .reduce((p, key) => p.set(key, userData[key]), 
          state
            .delete('error')
            .set('loggedIn', true)
            .set('isJustRegistered', justRegistered)
            .set('loggingIn', false))
      },    
    error: {
      401: (state, action) => state
        .delete('token')
        .set('loggingIn', false)
        .set('loggedIn', false)
        .set('error', 'loginErrorUnauthorized'),
      403: (state, action) => state
        .delete('token')
        .set('loggingIn', false)
        .set('loggedIn', false)
        .set('error', 'loginErrorForbidden'),
      default: (state, action) => state
        .set('error', 'loginError')
        .set('loggingIn', false)
      }
    });

  return createAsyncStores({ 
    init: {
      complete: (state, { payload }) => {
        return Object.keys(payload).reduce(
          (p, key) => p.set(key, payload[key]),
          state
            .set('initializing', false)
            .set('loggedIn', payload.token != null));
      }
    },

    logIn: createUserDataHandler({justRegistered: false}),

    register: createUserDataHandler({justRegistered: true}),

    logOff: () => { 
      storageRemove({
        ...dataFields,
        token: true
      });
      
      return initialState.set('initializing', false);
    },

    resetIsJustRegistered: state => state.set('isJustRegistered', false),

    updateProfile: {
      begin: (state, {payload: {data}}) => Object.keys(data).reduce(
        (p, key) => p.set(key, data[key]),
        state),
      complete: createUserDataHandler().complete
    },

    uploadProfileImage: {
      begin: state => state
        .set('uploadProgress', 0)
        .set('isUploadingProfileImage', true),
      progress: (state, {payload: {progress}}) => state
        .set('uploadProgress', progress),
      complete: (state, {payload: {profileImage}}) => {
        storageSet({profileImage});
        return state
          .set('profileImage', profileImage)
          .set('isUploadingProfileImage', false)
      },
      error: {
        default: (state, action) => state
          .set('uploadProgress', 0)
          .set('isUploadingProfileImage', false)
      }
    },

    locate: {
      begin: (state, action) => state,
      complete: state => state
    },

    resetError: (state, action) => state.delete('error'),
    },
    initialState, 
    {
      prefix: 'session'
    });
}
