import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import {useAppSelector} from '../../state';
import {selectUser} from '../../state/features/userSlice';
import {StackParamList} from './Chat';

const RoomScreen = ({}: NativeStackScreenProps<
  StackParamList,
  'RoomScreen'
>) => {
  const user = useAppSelector(selectUser);
  const [rooms, setRooms] = useState<string[]>([]);
  const [roomId, setRoomId] = useState<string>(rooms[0]);
  const [messages, setMessages] = useState<
    {text: string; posted: string; key: string}[]
  >([]);
  const [text, setText] = useState<string>('');
  const [count, setCount] = useState<number>(0);

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

  useEffect(() => {
    console.debug('rooms: ' + JSON.stringify(rooms));
    setRoomId(rooms[0]);
  }, [rooms]);

  useEffect(() => {
    console.debug('roomId: ' + roomId);
    if (roomId) {
      const subscriber = firestore()
        .collection('chat')
        .doc(roomId)
        .collection('messages')
        .orderBy('posted', 'asc')
        .limit(50)
        .onSnapshot(colSnapshot => {
          if (colSnapshot.empty) {
            return;
          }
          setMessages(
            colSnapshot.docs.map(docSnapshot => {
              // if (!docSnapshot.exists)
              //   return {
              //     text: 'Error: Not found',
              //     posted: 'Never',
              //   };
              const data = docSnapshot.data();
              return {
                text: data.text,
                posted: data.posted?.toString(),
                key: docSnapshot.id,
              };
            }),
          );
        });

      return () => subscriber();
    }

    return () => undefined;
  }, [roomId, count]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <Picker
        selectedValue={roomId}
        onValueChange={(value, _index) => setRoomId(value)}>
        {rooms.map(room => (
          <Picker.Item key={room} label={room} value={room} />
        ))}
      </Picker>
      <View style={{flex: 1, padding: 16}}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {messages.map(message => (
            <Text key={message.key}>
              {message.posted}: {message.text}
            </Text>
          ))}
        </View>
      </View>
      <View>
        <Text>Say: </Text>
        <TextInput
          onChangeText={text => setText(text)}
          placeholder="Say something"
          placeholderTextColor="#8b9cb5"
          autoCapitalize="none"
          keyboardType="default"
          returnKeyType="next"
          underlineColorAndroid="#f000"
          blurOnSubmit={false}>
          {text}
        </TextInput>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            if (!text) return;
            firestore()
              .collection('chat')
              .doc(roomId)
              .collection('messages')
              .add({
                text: user.name + ': ' + text,
                posted: new Date().toISOString(),
              })
              .then(() => {
                console.debug('Said: ' + text);
                setText('');
              });
          }}>
          <Text>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => setCount(count + 1)}>
          <Text>Update</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RoomScreen;
