import {
  checkNotifications,
  NotificationsResponse,
  requestNotifications,
} from 'react-native-permissions';

const req: (response: NotificationsResponse) => Promise<boolean> = async ({status, settings}) =>
  status !== 'granted' && status !== 'blocked' && status !== 'unavailable'
    ? requestNotifications(['alert', 'badge', 'sound']).then(req)
    : !(!settings.alert || !settings.badge || !settings.sound) && status === 'granted';

const requestUserPermission = async () => checkNotifications().then(req);

export default requestUserPermission;
