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
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {ChatStackParamList} from './Chat';
import {useAppSelector} from '../../state';
import {selectUser} from '../../state/features/userSlice';
import {launchImageLibrary} from 'react-native-image-picker';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from '../../styles';
import {ScrollView} from 'react-native-gesture-handler';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Section from '../../Component/Section';

const SettingsScreen = (
  _props: NativeStackScreenProps<ChatStackParamList, 'SettingsScreen'>,
) => {
  const user = useAppSelector(selectUser);

  const [errorText, setErrorText] = useState<string>('');

  const [newName, setNewName] = useState<string>('');
  const [avatar, setAvatar] = useState<any>(
    require('../../image/drawerWhite.png'),
  );

  const handleSubmitButton = () => {
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
      );
  };

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    if (user.userId) {
      const userRef = firestore().collection('users').doc(user.userId);

      const subscriber = userRef.onSnapshot(doc => {
        const data = doc.data();
        const name = decodeURIComponent(data?.name);
        const avatar = data?.avatar;

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
    <SafeAreaView style={backgroundStyle}>
      <KeyboardAvoidingView enabled>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{
            ...backgroundStyle,
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <View style={{alignItems: 'center'}}>
            <Image
              source={require('../../image/logo.png')}
              style={{
                width: '50%',
                height: 100,
                resizeMode: 'contain',
                margin: 30,
              }}
            />
          </View>
          <Section title="Chat App in React Native" />
          <Section title="Name:">
            <TextInput
              onChangeText={name => setNewName(name)}
              placeholder="Enter name" //dummy@abc.com
              placeholderTextColor="#8b9cb5"
              keyboardType="default"
              onSubmitEditing={handleSubmitButton}
              mode={'outlined'}
              returnKeyType="default"
              underlineColorAndroid="#f000"
              value={newName}
            />
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitButton}>
              <Text style={styles.buttonTextStyle}>Apply</Text>
            </TouchableOpacity>
          </Section>
          <Section title="Avatar:">
            <Text>Avatar:</Text>
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
                              );
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
            {errorText ? <Text>{errorText}</Text> : undefined}
          </Section>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
