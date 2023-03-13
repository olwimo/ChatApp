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
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import {useAppSelector} from '../../state';
import {selectUser} from '../../state/features/userSlice';
import {ChatStackParamList} from './Chat';
import {launchImageLibrary} from 'react-native-image-picker';

const RoomScreen = ({}: NativeStackScreenProps<
  ChatStackParamList,
  'RoomScreen'
>) => {
  const user = useAppSelector(selectUser);
  const [rooms, setRooms] = useState<string[]>([]);
  const [roomId, setRoomId] = useState<string>(rooms[0]);
  const [messages, setMessages] = useState<{
    [key: string]: {kind: string; posted: string; author: string};
  }>({});
  //   {kind: string; posted: string; author: string; key: string}[]
  // >([]);
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
      setMessages(_ => ({}));
      setCurrentTexts(_ => ({}));

      const subscriber = firestore()
        .collection('chat')
        .doc(roomId)
        .collection('messages')
        .orderBy('posted', 'asc')
        .limit(50)
        .onSnapshot(colSnapshot => {
          if (colSnapshot.empty) return;

          setMessages(_ => ({}));
          setCurrentTexts(_ => ({}));

          const nextTexts = colSnapshot.docs.reduce((acc, docSnapshot) => {
            // if (!docSnapshot.exists)
            //   return {
            //     text: 'Error: Not found',
            //     posted: 'Never',
            //   };
            const data: FirebaseFirestoreTypes.DocumentData =
              docSnapshot.data();
            const key: string = docSnapshot.id;
            const message = typeof data.text === 'string' ? data.text : '';
            const author = decodeURIComponent(
              message.indexOf(':') !== -1
                ? message.slice(0, message.indexOf(':'))
                : '',
            );
            const content = message.slice(message.indexOf(':') + 1);
            const kind = typeof data.kind === 'string' ? data.kind : '';
            const posted = new Date(
              Date.parse(typeof data.posted === 'string' ? data.posted : ''),
            ).toLocaleString();
            // const texts: {[key: string]: any} = {};
            setCurrentTexts(_ => {});

            if (kind === 'bucket/image') {
              setCurrentTexts(texts => ({
                ...texts,
                [key]: require('../../image/drawerWhite.png'),
              }));
              if (content) {
                storage()
                  .ref(content)
                  .getDownloadURL()
                  .then(url =>
                    setCurrentTexts(texts => ({...texts, [key]: {uri: url}})),
                  );
              }
            } else if (kind.indexOf('base64/image:') === 0) {
              setCurrentTexts(texts => ({
                ...texts,
                [key]: {
                  uri:
                    'data:image/' +
                    (kind.slice('base64/image:'.length) || 'jpeg') +
                    ';base64,' +
                    content,
                },
              }));
            } else {
              setCurrentTexts(texts => ({
                ...texts,
                [key]: content,
              }));
            }
            return {
              ...acc,
              [key]: {
                kind: kind,
                posted: posted,
                author: author,
              },
            };
          }, {});
          setMessages(_ => nextTexts);
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
        {Object.keys(messages).map(key => {
          const content = currentTexts[key];

          return messages[key].kind === 'bucket/image' ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              key={key}>
              <Text>
                &#91;{messages[key].posted}&#93; {messages[key].author}:
              </Text>
              <Image
                source={content}
                style={{
                  width: 300,
                  height: 300,
                  margin: 5,
                }}
              />
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              key={key}>
              <Text>
                &#91;{messages[key].posted}&#93; {messages[key].author}:{' '}
                {content}
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
                console.debug(JSON.stringify(image));
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
                        text:
                          encodeURIComponent(user.name || '') +
                          ':' +
                          asset.base64,
                        posted: new Date().toISOString(),
                        kind: 'base64/image:' + (asset.type || ''),
                      })
                      .then(() => {
                        console.debug('Said: ' + asset.fileName);
                        setErrorText('Base64 Image uploaded!');
                        setTimeout(() => setErrorText(''), 2000);
                        setCount(count + 1);
                      });
                  } else if (!asset.uri) {
                    setErrorText("Image Upload: Didn't return uri");
                  } else {
                    console.debug('Said: ' + asset.fileName);
                    setErrorText('Image: ' + asset.uri);
                    const path =
                      '/users/' +
                      (user.userId || 'none') +
                      '/' +
                      (asset.fileName || 'none');
                    const ref = storage().ref(path);

                    ref.putFile(asset.uri.slice('file://'.length)).then(_ => {
                      firestore()
                        .collection('chat')
                        .doc(roomId)
                        .collection('messages')
                        .add({
                          text:
                            encodeURIComponent(user.name || '') + ':' + path,
                          posted: new Date().toISOString(),
                          kind: 'bucket/image',
                        })
                        .then(() => {
                          console.debug('Said: ' + asset.fileName);
                          setErrorText('Base64 Image uploaded!');
                          setTimeout(() => setErrorText(''), 2000);
                          setCount(count + 1);
                        });
                    });
                  }
                }
                setTimeout(() => setErrorText(''), 2000);
              })
              .catch(reason => {
                setErrorText('Image Library Error: ' + JSON.stringify(reason));
                setTimeout(() => setErrorText(''), 2000);
              });
          }}>
          <Text>Send Image</Text>
        </TouchableOpacity>
        {errorText ? <Text>{errorText}</Text> : undefined}
      </View>
    </SafeAreaView>
  );
};

export default RoomScreen;
