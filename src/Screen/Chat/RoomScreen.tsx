import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import {useAppSelector} from '../../state';
import {selectUser} from '../../state/features/userSlice';
import {StackParamList} from './Chat';
import {launchImageLibrary} from 'react-native-image-picker';

const RoomScreen = ({}: NativeStackScreenProps<
  StackParamList,
  'RoomScreen'
>) => {
  const user = useAppSelector(selectUser);
  const [rooms, setRooms] = useState<string[]>([]);
  const [roomId, setRoomId] = useState<string>(rooms[0]);
  const [messages, setMessages] = useState<
    {kind: string; posted: string; author: string; key: string}[]
  >([]);
  const [currentTexts, setCurrentTexts] = useState<{[key: string]: any}>({});
  const [text, setText] = useState<string>('');
  const [errorText, setErrorText] = useState<string>('');
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    console.debug('userId changed: ' + user.userId);

    if (user.userId) {
      const subscriber = firestore()
        .collection('chat')
        .onSnapshot(colSnapshot => {
          if (colSnapshot.empty) {
            setRooms([]);
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
            setMessages([]);
            return;
          }
          // messages.findIndex(message =>)
          setCurrentTexts({});

          setMessages(
            colSnapshot.docs.map(docSnapshot => {
              // if (!docSnapshot.exists)
              //   return {
              //     text: 'Error: Not found',
              //     posted: 'Never',
              //   };
              const data = docSnapshot.data();
              const id = docSnapshot.id;
              const message = typeof data.text === 'string' ? data.text : '';
              const author = message.slice(0, message.indexOf(':'));
              const text = message.slice(message.indexOf(':') + 1);
              const kind = typeof data.kind === 'string' ? data.kind : '';
              const posted = Date.parse(
                typeof data.posted === 'string' ? data.posted : '',
              ).toLocaleString();

              if (kind === 'bucket/image') {
                setCurrentTexts(texts => ({
                  ...texts,
                  [id]: require('../../image/drawerWhite.png'),
                }));
                if (text)
                  storage()
                    .ref(text)
                    .getDownloadURL()
                    .then(url =>
                      setCurrentTexts(texts => ({...texts, [id]: {uri: url}})),
                    );
              } else if (
                typeof kind === 'string' &&
                kind.indexOf('base64/image:') === 0
              ) {
                setCurrentTexts(texts => ({
                  ...texts,
                  [id]: {
                    uri:
                      'data:image/' +
                      (kind.slice('base64/image:'.length) || 'jpeg') +
                      ';base64,' +
                      text,
                  },
                }));
              } else {
                setCurrentTexts(texts => ({
                  ...texts,
                  [id]: text,
                }));
              }
              return {
                kind: kind,
                posted: posted,
                key: id,
                author: author,
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
        {messages.map(message => {
          const text = currentTexts[message.key];

          return message.kind === 'bucket/image' ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text key={message.key}>{message.posted}: </Text>
              <Image
                key={message.key}
                source={text}
                style={{
                  width: 25,
                  height: 25,
                  margin: 5,
                }}
              />{' '}
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text key={message.key}>
              &#91;{message.posted}&#93; {message.author}: {text}
              </Text>
            </View>
          );
        })}
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
            if (!text || !roomId) return;
            firestore()
              .collection('chat')
              .doc(roomId)
              .collection('messages')
              .add({
                text: encodeURIComponent(user.name || '') + ':' + text,
                posted: new Date().toISOString(),
                kind: 'text/plain',
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
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            if (!roomId) return;
            launchImageLibrary({
              mediaType: 'photo',
              maxWidth: 300,
              maxHeight: 300,
            })
              .then(image => {
                if (image.didCancel) {
                  setErrorText('Image Upload: User cancelled');
                } else if (image.errorCode) {
                  setErrorText(
                    `Image Upload Error code ${image.errorCode}: ${image.errorMessage}`,
                  );
                } else if (image.assets?.length !== 1) {
                  setErrorText("Image Upload: Didn't choose exactly one image");
                } else {
                  const asset = image.assets[0];

                  if (asset.base64) {
                    firestore()
                      .collection('chat')
                      .doc(roomId)
                      .collection('messages')
                      .add({
                        text: encodeURIComponent(user.name || '') + ':' + asset.base64,
                        posted: new Date().toISOString(),
                        kind: 'base64/image:' + asset.type,
                      })
                      .then(() => {
                        console.debug('Said: ' + asset.fileName);
                        setErrorText('Base64 Image uploaded!');
                        setTimeout(() => setErrorText(''), 2000);
                      });
                  } else {
                    console.debug('Said: ' + asset.fileName);
                    setErrorText('Image: ' + asset.uri);
                // firestore()
                    // .collection('chat')
                    // .doc(roomId)
                    // .collection('messages')
                    // .add({
                    //   text: encodeURIComponent(user.name || '') + ':' + asset.base64,
                    //   posted: new Date().toISOString(),
                    //   kind: 'base64/image:' + asset.type,
                    // })
                    // .then(() => {
                    //   console.debug('Said: ' + asset.fileName);
                    //   setErrorText('Base64 Image uploaded!');
                    //   setTimeout(() => setErrorText(''), 2000);
                    // });
                  }
                }
                setTimeout(() => setErrorText(''), 2000);
              })
              .catch(reason => {
                setErrorText('Image Library Error: ' + JSON.stringify(reason));
                setTimeout(() => setErrorText(''), 2000);
              });
            setCount(count + 1);
          }}>
          <Text>Send Image</Text>
        </TouchableOpacity>
        {errorText ? <Text>{errorText}</Text> : undefined}
      </View>
    </SafeAreaView>
  );
};

export default RoomScreen;
