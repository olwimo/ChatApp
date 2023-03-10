/**
 * Chat Demo App
 * https://github.com/olwimo/ChatApp
 *
 * @format
 */

import React, {PropsWithChildren} from 'react';

import {
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import SplashScreen from './Screen/Splash';
import LoginScreen from './Screen/Login';
import RegisterScreen from './Screen/Register';
import Chat from './Screen/Chat';
import {Provider} from 'react-redux';
import {store} from './state';

export type AuthStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
};

export type RootStackParamList = {
  SplashScreen: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Chat: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const Auth = (_props: NativeStackScreenProps<RootStackParamList, 'Auth'>) => {
  // Stack Navigator for Login and Sign up Screen
  return (
    <AuthStack.Navigator initialRouteName="LoginScreen">
      <AuthStack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
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
    </AuthStack.Navigator>
  );
};

const App: (_props: PropsWithChildren<{}>) => JSX.Element = _props => {
  return (
    <Provider store={store}>
      <NavigationContainer>
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
            name="Chat"
            component={Chat}
            // Hiding header for Navigation Drawer as we will use our custom header
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
