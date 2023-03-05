import {initGoogle} from './google';

export {onGoogleButtonPress} from './google';

export const init = async () => {
  return initGoogle();
};

export {register, login, logout} from './basic';
