import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  createDrawerNavigator,
  DrawerScreenProps,
} from '@react-navigation/drawer';

import NavigationDrawerHeader from '../../Component/NavigationDrawerHeader';
import HomeScreen from './HomeScreen';
import CustomSidebarMenu from '../../Component/CustomSidebarMenu';
import SettingsScreen from './SettingsScreen';
import {RootStackParamList} from '../../App';

export type StackParamList = {
  HomeScreen: undefined;
  SettingsScreen: undefined;
};

export type DrawerStackParamList = {
  HomeScreenStack: undefined;
  SettingScreenStack: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();
const Drawer = createDrawerNavigator<DrawerStackParamList>();

const HomeScreenStack = ({
  navigation,
}: DrawerScreenProps<DrawerStackParamList, 'HomeScreenStack'>) => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: 'Home', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} />
          ),
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

const SettingScreenStack = ({
  navigation,
}: DrawerScreenProps<DrawerStackParamList, 'SettingScreenStack'>) => {
  return (
    <Stack.Navigator
      initialRouteName="SettingsScreen"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: '#307ecc', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          title: 'Settings', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};

const DrawerNavigatorRoutes = (
  _props: NativeStackScreenProps<RootStackParamList, 'DrawerNavigationRoutes'>,
) => {
  return (
    <Drawer.Navigator
      // drawerContentOptions={{
      //   activeTintColor: '#cee1f2',
      //   color: '#cee1f2',
      //   itemStyle: {marginVertical: 5, color: 'white'},
      //   labelStyle: {
      //     color: '#d8d8d8',
      //   },
      // }}
      screenOptions={{headerShown: false}}
      drawerContent={CustomSidebarMenu}>
      <Drawer.Screen
        name="HomeScreenStack"
        options={{drawerLabel: 'Home Screen'}}
        component={HomeScreenStack}
      />
      <Drawer.Screen
        name="SettingScreenStack"
        options={{drawerLabel: 'Setting Screen'}}
        component={SettingScreenStack}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigatorRoutes;
