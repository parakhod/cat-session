'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reduxFelineActions = require('redux-feline-actions');

exports.default = function (_ref) {
  var _ref$dataFields = _ref.dataFields,
      dataFields = _ref$dataFields === undefined ? {} : _ref$dataFields,
      _ref$urls = _ref.urls,
      urls = _ref$urls === undefined ? {} : _ref$urls,
      serverUrl = _ref.serverUrl;
  return (0, _reduxFelineActions.createActions)({
    init: {
      use: 'storage',
      data: _extends({}, dataFields, {
        token: true
      })
    },

    logIn: function logIn(data) {
      return {
        use: 'request',
        method: 'POST',
        url: urls.login || serverUrl + 'login',
        data: data
      };
    },

    logOff: true,

    resetIsJustRegistered: true,

    register: function register(data) {
      return {
        use: 'request',
        method: 'POST',
        url: urls.register || serverUrl + 'register',
        data: data
      };
    },

    locate: function locate(data) {
      return {
        use: 'request',
        method: 'PUT',
        url: urls.locate || serverUrl + 'locate',
        data: data
      };
    },

    updateProfile: function updateProfile(data) {
      return {
        use: 'request',
        method: 'PUT',
        url: urls.profile || serverUrl + 'profile',
        data: data
      };
    },

    uploadProfileImage: function uploadProfileImage(image) {
      return {
        use: 'request',
        method: 'POST',
        url: urls.upload || serverUrl + 'upload/image',
        sendAsForm: true,
        reportProgress: true,
        data: _extends({}, image, {
          role: 'avatar',
          target: 'user',
          crop: JSON.stringify({ x: 0, y: 0, width: 1, height: 1 })
        })
      };
    }
  }, {
    prefix: 'session'
  });
};