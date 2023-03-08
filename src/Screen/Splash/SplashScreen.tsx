import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {ActivityIndicator, Image, StyleSheet, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import {init} from '../../auth';
import {useAppDispatch} from '../../state';
import {setAuthProvider} from '../../state/features/userSlice';

const SplashScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'SplashScreen'>) => {
  const dispatch = useAppDispatch();

  const [animating, setAnimating] = useState<boolean>(true);

  useEffect(() => {
    if (animating) {
      const [provider, msg] = init();
      if (msg) console.debug(msg);
      dispatch(setAuthProvider(provider));
    } else {
      // const unsubscribe =
      auth().onAuthStateChanged(userState => {
        console.debug('SplashScreen.tsx: AuthStateChanged');

        navigation.navigate(userState ? 'DrawerNavigationRoutes' : 'Auth');
      });
      // navigation.navigate(
      //   auth().currentUser ? 'DrawerNavigationRoutes' : 'Auth',
      // );
    }
  }, [animating]);

  useEffect(() => {
    setTimeout(() => {
      console.debug('SplashScreen.tsx: timeout, animating is ' + animating);
      setAnimating(false);
      // navigation.navigate(
      //   auth().currentUser ? 'DrawerNavigationRoutes' : 'Auth',
      // );
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../image/logo.png')}
        style={{width: '90%', resizeMode: 'contain', margin: 30}}
      />
      <ActivityIndicator
        animating={animating}
        color="#FFFFFF"
        size="large"
        style={styles.activityIndicator}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#307ecc',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});
