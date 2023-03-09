import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  createDrawerNavigator,
  DrawerScreenProps,
} from '@react-navigation/drawer';

import NavigationDrawerHeader from '../../Component/NavigationDrawerHeader';
// import HomeScreen from './HomeScreen';
import CustomSidebarMenu from '../../Component/CustomSidebarMenu';
import SettingsScreen from './SettingsScreen';
import {RootStackParamList} from '../../App';
import {useAppSelector} from '../../state';
import {selectUser} from '../../state/features/userSlice';
import RoomScreen from './RoomScreen';

export type StackParamList = {
  // HomeScreen: undefined;
  RoomScreen: {roomId: string};
  SettingsScreen: undefined;
};

export type ChatStackParamList = {
  // HomeScreenStack: undefined;
  RoomScreenStack: {roomId: string};
  SettingScreenStack: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();
const Drawer = createDrawerNavigator<ChatStackParamList>();

// const HomeScreenStack = ({
//   navigation,
// }: DrawerScreenProps<ChatStackParamList, 'HomeScreenStack'>) => {
//   return (
//     <Stack.Navigator initialRouteName="HomeScreen">
//       <Stack.Screen
//         name="HomeScreen"
//         component={HomeScreen}
//         options={{
//           title: 'Home', //Set Header Title
//           headerLeft: () => (
//             <NavigationDrawerHeader navigationProps={navigation} />
//           ),
//           headerStyle: {
//             backgroundColor: '#307ecc', //Set Header color
//           },
//           headerTintColor: '#fff', //Set Header text color
//           headerTitleStyle: {
//             fontWeight: 'bold', //Set Header text style
//           },
//         }}
//       />
//     </Stack.Navigator>
//   );
// };

const RoomScreenStack = ({
  route,
  navigation,
}: DrawerScreenProps<ChatStackParamList, 'RoomScreenStack'>) => {
  const room = route.params.roomId;
  return (
    <Stack.Navigator initialRouteName="RoomScreen">
      <Stack.Screen
        name="RoomScreen"
        component={RoomScreen}
        initialParams={{roomId: room}}
        options={{
          title: room, //Set Header Title
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
  const user = useAppSelector(selectUser);
  const [rooms, setRooms] = useState<string[]>([]);

  useEffect(() => {
    console.debug('userId changed: ' + user.userId);

    if (user.userId) {
      const subscriber = firestore()
        .collection('chat')
        .onSnapshot(colSnapshot => {
          if (colSnapshot.empty) {
            return;
          }
          setRooms(colSnapshot.docs.map(docSnapshot => docSnapshot.id));
        });

      return () => subscriber();
    }

    return () => undefined;
  }, [user.userId]);

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
      {/* <Drawer.Screen
        name="HomeScreenStack"
        options={{drawerLabel: 'Welcome'}}
        component={HomeScreenStack}
      /> */}
      <Drawer.Screen
        name="SettingScreenStack"
        options={{drawerLabel: 'Settings'}}
        component={SettingScreenStack}
      />
      {rooms.map(room => (
        <Drawer.Screen
          key={room}
          name="RoomScreenStack"
          options={{drawerLabel: room}}
          component={RoomScreenStack}
          initialParams={{roomId: room}}
        />
      ))}
    </Drawer.Navigator>
  );
};

export default Chat;
