# Cat Session 🐈 for Redux 

Session manager, actions and reducers for Redux/Immutable.

## 🐱 Installation

__npm install -s cat-session__

## 🐱 Configuration
### Define custom fields for the session
```
const sessionDataFields = { 
  displayName: '',
  username: '',
  id: null,
  profileImage: null,
  email: null
}
```
### Add session actions:
```
import { createSessionActions } from 'cat-session';

const sessionActions = createSessionActions({
  dataFields: sessionDataFields,
  serverUrl: endpoint
  // urls: {} - you can define custom paths for the requests
});
```
### Add session reducers:
```
import { createSessionStore } from 'cat-session'

const stores = {
  session: createSessionStore(sessionDataFields),
  ...myOtherStores
}
```
## 🐱 Usage
### Actions
- `init()` - call it right after your app is started, the session values will be loaded from localStorage (or AsyncStorage for React Native)
- `logIn(data)` - POST request to `${serverUrl}login` or `urls.login`
- `logOff()` - log off
- `register(data)` - POST request to `${serverUrl}register` or `urls.register`
- `updateProfile(data)` - PUT request to `${serverUrl}profile` or `urls.profile`
- `uploadProfileImage(image)` - POST request to `${serverUrl}upload/image` or `urls.upload`, uploaded as form/multipart
- `locate(coords)` - PUT request to `${serverUrl}locate` or `urls.locate`, should be called on user position change
- `resetIsJustRegistered()` - reset `isJustRegistered`

### Store fields (all the fields are Immutable values!)
- `initializing` - true if session data in not available yet
- `loggedIn` - true if user is logged in
- `loggingIn` - true if user is logging in or registering
- `token` - session JWT
- `uploadProgress` - profile image upload progress in percent
- `isUploadingProfileImage` - true during profile image upload
- `isJustRegistered` - true after registration completed, could be reseted by calling `resetIsJustRegistered()`
- `error` - text value with login/registration error ('loginErrorUnauthorized', 'loginErrorForbidden', 'loginError')
- __ALL THE FIELDS FROM `sessionDataFields`__
