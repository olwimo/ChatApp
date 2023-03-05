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
      console.debug('Logout: Then');
      return userState;
    })
    .catch(error => {
      console.debug('Logout: Error - ' + error.code);
      throw error;
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
      throw error;
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
      throw error;
    });
