import {initGoogle} from './google';

export {onGoogleButtonPress} from './google';

export const init = () => {
  initGoogle();
};

export {register, login, logout} from './basic';
