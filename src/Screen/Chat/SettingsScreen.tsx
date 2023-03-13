import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {ChatStackParamList} from './Chat';
import {useAppDispatch, useAppSelector} from '../../state';
import {selectUser, setName} from '../../state/features/userSlice';
import {launchImageLibrary} from 'react-native-image-picker';

const SettingsScreen = (
  _props: NativeStackScreenProps<ChatStackParamList, 'SettingsScreen'>,
) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const [errorText, setErrorText] = useState<string>('');

  const [newName, setNewName] = useState<string>('');
  const [avatar, setAvatar] = useState<any>(
    require('../../image/drawerWhite.png'),
  );

  useEffect(() => {
    console.debug('userId changed: ' + user.userId);

    if (user.userId) {
      const userRef = firestore().collection('users').doc(user.userId);

      userRef.get().then(docSnapshot => {
        if (!docSnapshot.exists) {
          userRef.set({
            name: encodeURIComponent('New user'),
          });
          // .then(() => setName());
        }
      });
      const subscriber = userRef.onSnapshot(doc => {
        const data = doc.data();
        const name = decodeURIComponent(data?.name);
        const avatar = data?.avatar;

        dispatch(setName(name));
        setNewName(name);

        setAvatar(require('../../image/drawerWhite.png'));
        if (avatar) {
          storage()
            .ref(avatar)
            .getDownloadURL()
            .then(url => setAvatar({uri: url}));
        }
      });

      return () => subscriber();
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
          </Text>
          <View>
            <Text>Name: </Text>
            <TextInput
              style={styles.inputStyle}
              onChangeText={name => setNewName(name)}
              placeholder="Enter name" //dummy@abc.com
              placeholderTextColor="#8b9cb5"
              autoCapitalize="none"
              keyboardType="default"
              returnKeyType="next"
              underlineColorAndroid="#f000"
              blurOnSubmit={false}>
              {user.name}
            </TextInput>
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={() => {
                firestore()
                  .collection('users')
                  .doc(user.userId)
                  .set(
                    {
                      name: encodeURIComponent(newName),
                    },
                    {
                      merge: true,
                    },
                  )
                  .then(() => {
                    console.debug('Name changed to ' + newName);
                  });
              }}>
              <Text style={styles.buttonTextStyle}>Apply</Text>
            </TouchableOpacity>
            <Image
              source={avatar}
              style={{
                width: 30,
                height: 30,
                margin: 5,
              }}
            />
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={() => {
                launchImageLibrary({
                  mediaType: 'photo',
                  maxWidth: 60,
                  maxHeight: 60,
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
                      setErrorText(
                        "Image Upload: Didn't choose exactly one image",
                      );
                    } else {
                      const asset = image.assets[0];

                      if (!asset.uri || !asset.fileName) {
                        setErrorText(
                          "Image Upload: Didn't return both uri and filename",
                        );
                      } else {
                        console.debug('Avatar: ' + asset.fileName);
                        setErrorText(`Uploading ${asset.fileName}`);
                        // const suffix = asset.fileName.slice((asset.fileName.lastIndexOf('.') + 1) || asset.fileName.length);
                        const path =
                          '/users/' + user.userId + '/' + asset.fileName;
                        const ref = storage().ref(path);

                        ref
                          .putFile(asset.uri.slice('file://'.length))
                          .then(_ => {
                            firestore()
                              .collection('users')
                              .doc(user.userId)
                              .set(
                                {
                                  avatar: path,
                                },
                                {
                                  merge: true,
                                },
                              )
                              .then(() => {
                                console.debug('Avatar changed to ' + path);
                              });
                          });
                      }
                    }
                    setTimeout(() => setErrorText(''), 2000);
                  })
                  .catch(reason => {
                    setErrorText(
                      'Image Library Error: ' + JSON.stringify(reason),
                    );
                    setTimeout(() => setErrorText(''), 2000);
                  });
              }}>
              <Text style={styles.buttonTextStyle}>Choose avatar</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* <Text
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
        </Text> */}
        {errorText ? <Text>{errorText}</Text> : undefined}
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: '#7DE24E',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: 'black',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#dadae8',
  },
});
