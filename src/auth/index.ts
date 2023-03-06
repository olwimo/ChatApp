import { AuthProvider } from '../state/types/user';
import {autoBasic, logoutBasic} from './basic';
import {autoGoogle, initGoogle} from './google';

export {onGoogleButtonPress} from './google';

export const init = async () => {
  return initGoogle()
  .then(() => autoBasic().catch(autoGoogle))
  .catch(autoBasic);
};

export {registerBasic, loginBasic} from './basic';

export const logout = async (provider: AuthProvider) => {
  switch (provider) {
    case 'Basic':
      return logoutBasic();
    case 'Google':
        return logoutGoogle();
    }
}