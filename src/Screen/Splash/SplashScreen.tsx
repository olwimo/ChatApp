import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {ActivityIndicator, Image, StyleSheet, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import { init } from '../../auth';
// import { useAppDispatch, useAppSelector } from "../state";
// import { selectUser, setCurrentUser } from "../state/features/userSlice";

const SplashScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'SplashScreen'>) => {
  // const dispatch = useAppDispatch();
  // const user = useAppSelector(selectUser);

  const [animating, setAnimating] = useState<boolean>(true);
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    // const unsubscribe =
    auth().onAuthStateChanged(userState => {
      console.debug('SplashScreen.tsx: AuthStateChanged');

      if (ready && !animating)
        navigation.navigate(userState ? 'DrawerNavigationRoutes' : 'Auth');
    });

    init().finally(() => {
      console.debug('SplashScreen.tsx: init.finally');
      setReady(true);
      // if (!animating) navigation.navigate(
      //   auth().currentUser ? 'DrawerNavigationRoutes' : 'Auth',
      // );
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setAnimating(false);
      if (ready) navigation.navigate(
        auth().currentUser ? 'DrawerNavigationRoutes' : 'Auth',
      );
    }, 5000);
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
