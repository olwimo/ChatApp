/**
 * Chat Demo App
 * https://github.com/olwimo/ChatApp
 *
 * @format
 */

import React from 'react';

import {
  Platform,
  PlatformColor,
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import {Header} from 'react-native/Libraries/NewAppScreen';

// import {Provider} from 'react-redux';
// import {store} from './state';

import SplashScreen from './Screen/Splash';
import LoginScreen from './Screen/Login';
import RegisterScreen from './Screen/Register';
import DrawerNavigationRoutes from './Screen/DrawerNavigationRoutes';

export type RootStackParamList = {
  SplashScreen: undefined;
  Auth: undefined;
  DrawerNavigationRoutes: undefined;
  // DrawerNavigationRoutes: NavigatorScreenParams<undefined>;
  LoginScreen: undefined;
  RegisterScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Auth = (_props: NativeStackScreenProps<RootStackParamList, 'Auth'>) => {
  // Stack Navigator for Login and Sign up Screen
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{
          title: 'Register', //Set Header Title
          headerStyle: {
            backgroundColor: '#307ecc', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = Platform.select({
    ios: {
      backgroundColor: PlatformColor('systemBackground'),
    },
    android: {
      backgroundColor: isDarkMode
        ? PlatformColor('@android:color/background_dark')
        : PlatformColor('@android:color/background_light'),
    },
    default: {
      backgroundColor: isDarkMode ? 'black' : 'white',
    },
  });

  return (
    // <Provider store={store}>
    <NavigationContainer>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}>
          <Header />
          <Stack.Navigator initialRouteName="SplashScreen">
            {/*SplashScreen while loading*/}
            <Stack.Screen
              name="SplashScreen"
              component={SplashScreen}
              options={{headerShown: false}}
            />
            {/* Auth Navigator which includer Login Signup will come once */}
            <Stack.Screen
              name="Auth"
              component={Auth}
              options={{headerShown: false}}
            />
            {/* Navigation Drawer as a landing page */}
            <Stack.Screen
              name="DrawerNavigationRoutes"
              component={DrawerNavigationRoutes}
              // Hiding header for Navigation Drawer as we will use our custom header
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </ScrollView>
      </SafeAreaView>
    </NavigationContainer>
    // </Provider>
  );
};

export default App;
