import React from 'react';
import {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  createDrawerNavigator,
} from '@react-navigation/drawer';

import CustomSidebarMenu from '../../Component/CustomSidebarMenu';
import SettingsScreen from './SettingsScreen';
import {RootStackParamList} from '../../App';
import RoomScreen from './RoomScreen';

export type ChatStackParamList = {
  RoomScreen: undefined;
  SettingsScreen: undefined;
};

const Drawer = createDrawerNavigator<ChatStackParamList>();

const Chat = (_props: NativeStackScreenProps<RootStackParamList, 'Chat'>) => {
  return (
    <Drawer.Navigator
      screenOptions={{
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
        name="SettingsScreen"
        options={{drawerLabel: 'Settings'}}
        component={SettingsScreen}
      />
      <Drawer.Screen
        name="RoomScreen"
        options={{drawerLabel: 'Chat'}}
        component={RoomScreen}
      />
    </Drawer.Navigator>
  );
};

export default Chat;
