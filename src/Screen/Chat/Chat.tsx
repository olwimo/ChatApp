import React, {useEffect, useState} from 'react';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  createDrawerNavigator,
  DrawerScreenProps,
} from '@react-navigation/drawer';

import NavigationDrawerHeader from '../../Component/NavigationDrawerHeader';
import CustomSidebarMenu from '../../Component/CustomSidebarMenu';
import SettingsScreen from './SettingsScreen';
import {RootStackParamList} from '../../App';
import RoomScreen from './RoomScreen';

export type StackParamList = {
  RoomScreen: undefined;
  SettingsScreen: undefined;
};

export type ChatStackParamList = {
  RoomScreenStack: undefined;
  SettingScreenStack: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();
const Drawer = createDrawerNavigator<ChatStackParamList>();

const RoomScreenStack = ({
  navigation,
}: DrawerScreenProps<ChatStackParamList, 'RoomScreenStack'>) => {
  return (
    <Stack.Navigator initialRouteName="RoomScreen">
      <Stack.Screen
        name="RoomScreen"
        component={RoomScreen}
        options={{
          title: 'Chat', //Set Header Title
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
}: DrawerScreenProps<ChatStackParamList, 'SettingScreenStack'>) => {
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

const Chat = (_props: NativeStackScreenProps<RootStackParamList, 'Chat'>) => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: '#cee1f2',
        drawerContentStyle: {shadowColor: '#cee1f2'},
        drawerItemStyle: {
          marginVertical: 5,
          borderColor: 'white',
        },
        drawerLabelStyle: {
          color: '#d8d8d8',
        },
      }}
      drawerContent={CustomSidebarMenu}>
      <Drawer.Screen
        name="SettingScreenStack"
        options={{drawerLabel: 'Settings'}}
        component={SettingScreenStack}
      />
      <Drawer.Screen
        name="RoomScreenStack"
        options={{drawerLabel: 'Chat'}}
        component={RoomScreenStack}
      />
    </Drawer.Navigator>
  );
};

export default Chat;
