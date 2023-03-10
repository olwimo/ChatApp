import auth from '@react-native-firebase/auth';

import {AuthProvider, withMsg} from '../state/types/user';

export const autoBasic: () => withMsg<AuthProvider> = () =>
  auth().currentUser ? ['Basic'] : ['None', 'No Basic login'];

export const registerBasic = async (email: string, password: string) => {
  if (!email) {
    return Promise.resolve<withMsg<AuthProvider>>([
      'None',
      'Please fill out Email',
    ]);
  }
  if (!password) {
    return Promise.resolve<withMsg<AuthProvider>>([
      'None',
      'Please fill out Password',
    ]);
  }

  return auth()
    .createUserWithEmailAndPassword(email, password)
    .then<withMsg<AuthProvider>>(() => ['Basic', 'Register: Then'])
    .catch<withMsg<AuthProvider>>(error => [
      'None',
      'Register: Error - ' + JSON.stringify(error),
    ]);
};

export const loginBasic = async (email: string, password: string) => {
  if (!email) {
    return Promise.resolve<withMsg<AuthProvider>>([
      'None',
      'Please fill out Email',
    ]);
  }
  if (!password) {
    return Promise.resolve<withMsg<AuthProvider>>([
      'None',
      'Please fill out Password',
    ]);
  }

  return auth()
    .signInWithEmailAndPassword(email, password)
    .then<withMsg<AuthProvider>>(() => ['Basic', 'Login: Then'])
    .catch<withMsg<AuthProvider>>(error => [
      'None',
      'Login: Error - ' + JSON.stringify(error),
    ]);
};
export const logoutBasic = () =>
  auth()
    .signOut()
    .then<withMsg<AuthProvider>>(() => ['None'])
    .catch<withMsg<AuthProvider>>(error => [
      'Basic',
      'Sign-out error: ' + JSON.stringify(error),
    ]);
