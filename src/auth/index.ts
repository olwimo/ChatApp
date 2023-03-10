import {AuthProvider, withMsg} from '../state/types/user';
import {autoBasic, logoutBasic} from './basic';
import {initFacebook, logoutFacebook} from './facebook';
import {initGoogle, logoutGoogle} from './google';

export {onGoogleButtonPress} from './google';
export {onFBLoginFinished} from './facebook';

export const init = () => {
  initGoogle();
  initFacebook();

  return autoBasic();
};

export {registerBasic, loginBasic} from './basic';

export const logout: (
  provider: AuthProvider,
) => Promise<withMsg<AuthProvider>> = async provider => {
  switch (provider) {
    case 'Basic':
      return logoutBasic();
    case 'Google':
      return logoutGoogle();
    case 'FaceBook':
      return logoutFacebook();
    case 'Pending':
      return ['Pending', 'In progress!'];
    case 'None':
      return ['None', 'Not logged in!'];
  }
};
