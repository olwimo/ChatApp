import auth from '@react-native-firebase/auth';

export const register = async (email: string, password: string) => {
  if (!email) {
    throw 'Please fill out Email';
  }
  if (!password) {
    throw 'Please fill out Password';
  }

  return auth()
    .createUserWithEmailAndPassword(email, password)
    .then(userState => {
      console.debug('Register: Then');
      return userState;
    })
    .catch(error => {
      console.debug('Register: Error - ' + error.code);
      throw 'Register: Error - ' + error.code;
    });
};

export const login = async (email: string, password: string) => {
  if (!email) {
    throw 'Please fill out Email';
  }
  if (!password) {
    throw 'Please fill out Password';
  }

  return auth()
    .signInWithEmailAndPassword(email, password)
    .then(userState => {
      console.debug('Login: Then');
      return userState;
    })
    .catch(error => {
      console.debug('Login: Error - ' + error.code);
      throw 'Login: Error - ' + error.code;
    });
};
export const logout = () =>
  auth()
    .signOut()
    .then(() => {
      console.debug('Signed out');
    })
    .catch(error => {
      console.debug('Sign-out error: ' + error.code);
      throw 'Sign-out error: ' + error.code;
    });
