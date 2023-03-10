import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useAppSelector} from '../../state';
import {selectUser} from '../../state/features/userSlice';
import {StackParamList} from './Chat';

const RoomScreen = ({
  route,
}: NativeStackScreenProps<StackParamList, 'RoomScreen'>) => {
  const user = useAppSelector(selectUser);
  const [messages, setMessages] = useState<
    {text: string; posted: string; key: string}[]
  >([]);
  const [text, setText] = useState<string>('');
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (route.params.roomId) {
      const subscriber = firestore()
        .collection('chat')
        .doc(route.params.roomId)
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
  }, [route.params.roomId, count]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <Text>{route.params.roomId}:</Text>
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
              .doc(route.params.roomId)
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
