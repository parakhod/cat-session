'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _catStores = require('cat-stores');

var _catStores2 = _interopRequireDefault(_catStores);

var _catBox = require('cat-box');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = function (dataFields) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


  var token = null;

  try {
    token = localStorage.token;
  } catch (e) {}

  var initialState = _immutable2.default.fromJS(_extends({
    initializing: true,
    loggedIn: token != null,
    loggingIn: false,
    token: token,
    uploadProgress: 0,
    isUploadingProfileImage: false,
    isJustRegistered: false
  }, dataFields));

  var createUserDataHandler = function createUserDataHandler() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$justRegistered = _ref.justRegistered,
        justRegistered = _ref$justRegistered === undefined ? false : _ref$justRegistered;

    return {
      begin: function begin(state, action) {
        return state.set('loggingIn', true).delete('error');
      },
      complete: function complete(state, _ref2) {
        var payload = _ref2.payload;


        if (Array.isArray(options.roles)) {
          if (options.roles.indexOf(payload.role) === -1) {
            return state.set('error', 'loginErrorInsufficientRights').set('loggingIn', false);
          }
        }

        var f = Object.keys(_extends({
          token: null
        }, dataFields));
        var userData = f.reduce(function (p, key) {
          return payload[key] != null ? _extends({}, p, _defineProperty({}, key, payload[key])) : p;
        }, {});

        (0, _catBox.storageSet)(userData);

        return Object.keys(userData).reduce(function (p, key) {
          return p.set(key, userData[key]);
        }, state.delete('error').set('loggedIn', true).set('isJustRegistered', justRegistered).set('loggingIn', false));
      },
      error: {
        401: function _(state, action) {
          return state.delete('token').set('loggingIn', false).set('loggedIn', false).set('error', 'loginErrorUnauthorized');
        },
        403: function _(state, action) {
          return state.delete('token').set('loggingIn', false).set('loggedIn', false).set('error', 'loginErrorForbidden');
        },
        default: function _default(state, action) {
          return state.set('error', 'loginError').set('loggingIn', false);
        }
      }
    };
  };

  return (0, _catStores2.default)({
    init: {
      complete: function complete(state, _ref3) {
        var payload = _ref3.payload;

        return Object.keys(payload).reduce(function (p, key) {
          return p.set(key, payload[key]);
        }, state.set('initializing', false).set('loggedIn', payload.token != null));
      }
    },

    logIn: createUserDataHandler({ justRegistered: false }),

    register: createUserDataHandler({ justRegistered: true }),

    logOff: function logOff() {
      (0, _catBox.storageRemove)(_extends({}, dataFields, {
        token: true
      }));

      return initialState.set('initializing', false);
    },

    resetIsJustRegistered: function resetIsJustRegistered(state) {
      return state.set('isJustRegistered', false);
    },

    updateProfile: {
      begin: function begin(state, _ref4) {
        var data = _ref4.payload.data;
        return Object.keys(data).reduce(function (p, key) {
          return p.set(key, data[key]);
        }, state);
      },
      complete: createUserDataHandler().complete
    },

    uploadProfileImage: {
      begin: function begin(state) {
        return state.set('uploadProgress', 0).set('isUploadingProfileImage', true);
      },
      progress: function progress(state, _ref5) {
        var _progress = _ref5.payload.progress;
        return state.set('uploadProgress', _progress);
      },
      complete: function complete(state, _ref6) {
        var profileImage = _ref6.payload.profileImage;

        (0, _catBox.storageSet)({ profileImage: profileImage });
        return state.set('profileImage', profileImage).set('isUploadingProfileImage', false);
      },
      error: {
        default: function _default(state, action) {
          return state.set('uploadProgress', 0).set('isUploadingProfileImage', false);
        }
      }
    },

    locate: {
      begin: function begin(state, action) {
        return state;
      },
      complete: function complete(state) {
        return state;
      }
    },

    resetError: function resetError(state, action) {
      return state.delete('error');
    }
  }, initialState, {
    prefix: 'session'
  });
};