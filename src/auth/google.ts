import auth from '@react-native-firebase/auth';
import {
  ConfigureParams,
  GoogleSignin,
  NativeModuleError,
  statusCodes,
  User,
} from '@react-native-google-signin/google-signin';

const params: ConfigureParams = {
  webClientId:
    '29469695820-ro9fdhinrlimp4spqe3nsc1gtufauvmu.apps.googleusercontent.com',
};

const credentialSignIn = ({idToken}: User) => {
  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  // Sign-in the user with the credential
  return auth().signInWithCredential(googleCredential);
};

const errorHandler = (error: NativeModuleError) => {
  if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    // user cancelled the login flow
  } else if (error.code === statusCodes.IN_PROGRESS) {
    // operation (e.g. sign in) is in progress already
  } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    // play services not available or outdated
  } else {
    // some other error
  }
  throw error;
};

export const initGoogle = async () => {
  GoogleSignin.configure(params);

  // Check if your device supports Google Play

  await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

  // Get the users ID token
  return GoogleSignin.signInSilently()
    .then(credentialSignIn)
    .catch(errorHandler)
    .catch(error => {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // user has not signed in yet
      }
      throw error;
    });
};

export const onGoogleButtonPress = async () => {
  // Check if your device supports Google Play
  // await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

  // Get the users ID token
  return GoogleSignin.signIn().then(credentialSignIn).catch(errorHandler);
};
