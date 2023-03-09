import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAppSelector } from '../../state';
import { selectUser } from '../../state/features/userSlice';
import {StackParamList} from './Chat';

const HomeScreen = (
  _props: NativeStackScreenProps<StackParamList, 'HomeScreen'>,
) => {
  const user = useAppSelector(selectUser);
  const [rooms, setRooms] = useState<string[]>([]);

  useEffect(() => {
    console.debug('userId changed: ' + user.userId);

    if (user.userId) {
      const roomsRef = firestore().collection('chat');

      roomsRef.get().then(colSnapshot => {
        
        if (colSnapshot.empty) {
          return;
        }
        setRooms(colSnapshot.docs.map(docSnapshot => docSnapshot.id));
        // console.debug(JSON.stringify(docSnapshot.data()));
      });
      // const subscriber = userRef.onSnapshot(doc => {
      //   setName(doc.data()?.name);
      // });

      // return () => subscriber();
    }

    return () => undefined;
  }, [user.userId]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, padding: 16}}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              marginBottom: 16,
            }}>
            Chat App in React Native
            {'\n\n'}
            This is the Home Screen
          </Text>
          {rooms.map(room => <Text key={room}>{room}</Text>)}
        </View>
        <Text
          style={{
            fontSize: 18,
            textAlign: 'center',
            color: 'grey',
          }}>
          Chat App{'\n'}React Native
        </Text>
        <Text
          style={{
            fontSize: 16,
            textAlign: 'center',
            color: 'grey',
          }}>
          www.github.com/olwimo
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
