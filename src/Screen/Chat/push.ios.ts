import messaging from '@react-native-firebase/messaging';

const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) console.debug(`Authorization status: ${authStatus}`);

    return enabled;
};

export default requestUserPermission;
