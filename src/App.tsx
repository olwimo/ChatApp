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
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SplashScreen from './Screen/Splash';
import Chat, {ChatStackParamList} from './Screen/Chat';
import {Provider} from 'react-redux';
import {persistor, store} from './state';
import {PersistGate} from 'redux-persist/integration/react';
import {MD3DarkTheme, MD3LightTheme, Provider as PaperProvider} from 'react-native-paper';
import Auth, {AuthStackParamList} from './Screen/Auth';
import { useColorScheme } from 'react-native';

export type RootStackParamList = {
  SplashScreen: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Chat: NavigatorScreenParams<ChatStackParamList>;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: (_props: PropsWithChildren<{}>) => JSX.Element = _props => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={isDarkMode ? MD3DarkTheme : MD3LightTheme}>
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
                options={{headerShown: false}}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
