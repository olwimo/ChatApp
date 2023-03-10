import auth from '@react-native-firebase/auth';
import {
  ConfigureParams,
  GoogleSignin,
  NativeModuleError,
  statusCodes,
  User,
} from '@react-native-google-signin/google-signin';
import {AuthProvider, withMsg} from '../state/types/user';
import {logoutBasic} from './basic';

const params: ConfigureParams = {
  webClientId:
    '29469695820-ro9fdhinrlimp4spqe3nsc1gtufauvmu.apps.googleusercontent.com',
};

const credentialSignIn: ({
  idToken,
}: User) => Promise<withMsg<AuthProvider>> = async ({idToken}) => {
  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  // Sign-in the user with the credential
  try {
    await auth().signInWithCredential(googleCredential);
  } catch (reason) {
    return ['None', 'Credential error: ' + JSON.stringify(reason)];
  }
  return ['Google'];
};

const errorHandler: (
  error: NativeModuleError,
) => withMsg<AuthProvider> = error => {
  if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    // user cancelled the login flow
  } else if (error.code === statusCodes.IN_PROGRESS) {
    // operation (e.g. sign in) is in progress already
  } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    // play services not available or outdated
  } else {
    // some other error
  }
  return ['None', 'Google error: ' + error.message];
};

export const initGoogle = async () => {
  GoogleSignin.configure(params);
};

export const onGoogleButtonPress: () => Promise<
  withMsg<AuthProvider>
> = async () => {
  try {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
  } catch (error) {
    return ['None', "Doesn't have Google Play Services"];
  }

  // Get the users ID token
  return GoogleSignin.signIn().then(credentialSignIn).catch(errorHandler);
};

export const logoutGoogle: () => Promise<withMsg<AuthProvider>> = async () => {
  await GoogleSignin.signOut();
  const [provider, msg] = await logoutBasic();
  return [provider !== 'Basic' ? provider : 'Google', msg];
};
