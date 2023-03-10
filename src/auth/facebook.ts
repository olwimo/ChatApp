import auth from '@react-native-firebase/auth';
import {AccessToken, LoginResult} from 'react-native-fbsdk-next';
import {Settings} from 'react-native-fbsdk-next';
import {AuthProvider, withMsg} from '../state/types/user';
import {logoutBasic} from './basic';

export const initFacebook = () => {
  // Setting the facebook app id using setAppID
  // Remember to set CFBundleURLSchemes in Info.plist on iOS if needed
  Settings.setAppID('1207055786592486');

  Settings.setAdvertiserTrackingEnabled(false);
  // Ask for consent first if necessary
  // Possibly only do this for iOS if no need to handle a GDPR-type flow
  Settings.initializeSDK();
};

export const onFBLoginFinished = async (
  error: Record<string, unknown>,
  result: LoginResult,
) => {
  if (error) {
    console.log('login has error: ' + JSON.stringify(error));
    return Promise.resolve<withMsg<AuthProvider>>([
      'None',
      'login has error: ' + JSON.stringify(error),
    ]);
  } else if (!result || result.isCancelled) {
    console.log('login is cancelled.');
    return Promise.resolve<withMsg<AuthProvider>>([
      'None',
      'login is cancelled.',
    ]);
  }
  const data = await AccessToken.getCurrentAccessToken();
  if (!data)
    return Promise.resolve<withMsg<AuthProvider>>([
      'None',
      'Something went wrong obtaining access token',
    ]);
  return auth()
    .signInWithCredential(
      auth.FacebookAuthProvider.credential(data.accessToken),
    )
    .then<withMsg<AuthProvider>>(_user => ['FaceBook'])
    .catch<withMsg<AuthProvider>>(reason => {
      return ['None', 'Login error: ' + JSON.stringify(reason)];
    });
};

export const logoutFacebook: () => Promise<
  withMsg<AuthProvider>
> = async () => {
  const [provider, msg] = await logoutBasic();
  return [provider !== 'Basic' ? provider : 'FaceBook', msg];
};
