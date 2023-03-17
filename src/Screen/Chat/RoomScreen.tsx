import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {Text, TextInput} from 'react-native-paper';
import {
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

import {useAppDispatch, useAppSelector} from '../../state';
import {selectUser, setRoomId} from '../../state/features/userSlice';
import {ChatStackParamList} from './Chat';
import {launchImageLibrary} from 'react-native-image-picker';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {ScrollView} from 'react-native-gesture-handler';
import Section from '../../Component/Section';
import styles from '../../styles';

const RoomScreen = ({}: NativeStackScreenProps<
  ChatStackParamList,
  'RoomScreen'
>) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const [rooms, setRooms] = useState<string[]>([]);
  const [messages, setMessages] = useState<{
    [key: string]: {kind: string; posted: string; author: string};
  }>({});

  const [currentTexts, setCurrentTexts] = useState<{[key: string]: any}>({});
  const [currentUsers, setCurrentUsers] = useState<{
    [key: string]: {avatar: any; name: string};
  }>({});

  const [text, setText] = useState<string>('');
  const [errorText, setErrorText] = useState<string>('');
  const [count, setCount] = useState<number>(0);

  const handleSendButton = () => {
    if (!text || !user.roomId) return;
    firestore()
      .collection('chat')
      .doc(user.roomId)
      .collection('messages')
      .add({
        text: text,
        author: user.userId || 'admin',
        posted: new Date().toISOString(),
        kind: 'text/plain',
      })
      .then(() => {
        console.debug('Said: ' + text);
        setText('');
      });
  };

  const handleImageButton = () => {
    if (!user.roomId) return;
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

          if (!asset.uri || !asset.fileName) {
            setErrorText("Image Upload: Didn't return both uri and filename");
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
                .doc(user.roomId)
                .collection('messages')
                .add({
                  text: path,
                  author: user.userId || 'admin',
                  posted: new Date().toISOString(),
                  kind: 'bucket/image',
                })
                .then(() => {
                  console.debug('Said: ' + asset.fileName);
                  setErrorText('Image uploaded!');
                  setTimeout(() => setErrorText(''), 2000);
                  // setCount(count + 1);
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
  };

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    const onMessageReceived = async (
      message: FirebaseMessagingTypes.RemoteMessage,
    ) => {
      if (message.data?.roomId !== user.roomId) return;
      if (typeof message.data?.notifee === 'string')
        notifee.displayNotification(JSON.parse(message.data?.notifee));
      setCount(count + 1);
    };
    messaging().onMessage(onMessageReceived);
    messaging().setBackgroundMessageHandler(onMessageReceived);
  }, []);

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
    if (!user.roomId) dispatch(setRoomId(rooms[0]));
  }, [rooms]);

  useEffect(() => {
    if (user.roomId) {
      const subscriber = firestore()
        .collection('users')
        .onSnapshot(colSnapshot => {
          setCurrentUsers(_ => ({}));
          if (colSnapshot.empty) return;

          colSnapshot.docs.forEach(docSnapshot => {
            if (!docSnapshot.exists) return;

            const data: FirebaseFirestoreTypes.DocumentData =
              docSnapshot.data();
            const key: string = docSnapshot.id;
            const name = typeof data.name === 'string' ? data.name : 'Nemo';
            const avatar = typeof data.avatar === 'string' ? data.avatar : '';

            setCurrentUsers(users => ({
              ...users,
              [key]: {
                name: decodeURIComponent(name),
                avatar: require('../../image/drawerWhite.png'),
              },
            }));
            if (avatar) {
              storage()
                .ref(avatar)
                .getDownloadURL()
                .then(url =>
                  setCurrentUsers(users => ({
                    ...users,
                    [key]: {
                      ...users[key],
                      avatar: {uri: url},
                    },
                  })),
                );
            }
          });
        });

      return () => subscriber();
    }

    return () => undefined;
  }, [user.roomId, count]);

  useEffect(() => {
    console.debug('roomId: ' + user.roomId);
    if (user.roomId) {
      const subscriber = firestore()
        .collection('chat')
        .doc(user.roomId)
        .collection('messages')
        .orderBy('posted', 'asc')
        .limit(50)
        .onSnapshot(colSnapshot => {
          setMessages(_ => ({}));
          setCurrentTexts(_ => ({}));
          if (colSnapshot.empty) return;

          colSnapshot.docs.forEach(docSnapshot => {
            if (!docSnapshot.exists) return;

            const data: FirebaseFirestoreTypes.DocumentData =
              docSnapshot.data();
            const key: string = docSnapshot.id;
            const message = typeof data.text === 'string' ? data.text : '';
            const author =
              typeof data.author === 'string' ? data.author : 'admin';
            const content = message.slice(message.indexOf(':') + 1);
            const kind = typeof data.kind === 'string' ? data.kind : '';
            const posted = new Date(
              Date.parse(typeof data.posted === 'string' ? data.posted : ''),
            ).toLocaleString();

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
            } else {
              setCurrentTexts(texts => ({
                ...texts,
                [key]: content,
              }));
            }
            setMessages(messages => ({
              ...messages,
              [key]: {
                kind: kind,
                posted: posted,
                author: author,
              },
            }));
          });
        });

      return () => subscriber();
    }

    return () => undefined;
  }, [user.roomId, count]);

  return (
    <SafeAreaView style={{...backgroundStyle, height: '100%'}}>
      <Picker
        selectedValue={user.roomId}
        onValueChange={(value, _index) => dispatch(setRoomId(value))}>
        {rooms.map(room => (
          <Picker.Item key={room} label={room} value={room} />
        ))}
      </Picker>
      <KeyboardAvoidingView enabled style={{height: '100%'}}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{
            ...backgroundStyle,
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            height: '100%',
          }}>
          {Object.keys(messages).map(key => {
            const content = currentTexts[key];
            console.debug(
              `currentUsers: ${JSON.stringify(
                currentUsers,
              )}, messages[key]: ${JSON.stringify(messages[key])}`,
            );

            return messages[key].kind === 'bucket/image' ? (
              <Section key={key} title={`&#91;${messages[key].posted}&#93;:`}>
                <Image
                  source={
                    currentUsers[messages[key].author]?.avatar ||
                    require('../../image/drawerWhite.png')
                  }
                  style={{
                    width: 30,
                    height: 30,
                    margin: 5,
                  }}
                />
                <Text>
                  {currentUsers[messages[key].author]?.name || '<Loading name>'}
                  :
                </Text>
                <Image
                  source={content}
                  style={{
                    width: 300,
                    height: 300,
                    margin: 5,
                  }}
                />
              </Section>
            ) : (
              <Section key={key} title={`&#91;${messages[key].posted}&#93;:`}>
                <Image
                  source={
                    currentUsers[messages[key].author]?.avatar ||
                    require('../../image/drawerWhite.png')
                  }
                  style={{
                    width: 30,
                    height: 30,
                    margin: 5,
                  }}
                />
                <Text>
                  {currentUsers[messages[key].author]?.name || '<Loading name>'}
                  : {content}
                </Text>
              </Section>
            );
          })}

          <Section title="Say:">
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
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSendButton}>
              <Text onPress={handleSendButton} style={styles.buttonTextStyle}>
                Send
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={() => setCount(count + 1)}>
              <Text onPress={() => setCount(count + 1)}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleImageButton}>
              <Text onPress={handleImageButton}>Send Image</Text>
            </TouchableOpacity>
            {errorText ? <Text>{errorText}</Text> : undefined}
          </Section>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RoomScreen;
