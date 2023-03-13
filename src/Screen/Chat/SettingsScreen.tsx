import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {ChatStackParamList} from './Chat';
import {useAppDispatch, useAppSelector} from '../../state';
import {selectUser, setName} from '../../state/features/userSlice';

const SettingsScreen = (
  _props: NativeStackScreenProps<ChatStackParamList, 'SettingsScreen'>,
) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const [newName, setNewName] = useState<string>('');

  useEffect(() => {
    console.debug('userId changed: ' + user.userId);

    if (user.userId) {
      const userRef = firestore().collection('users').doc(user.userId);

      userRef.get().then(docSnapshot => {
        if (!docSnapshot.exists) {
          userRef.set({
            name: 'New user',
          });
          // .then(() => setName());
        }
      });
      const subscriber = userRef.onSnapshot(doc => {
        const name = doc.data()?.name;
        dispatch(setName(name));
        setNewName(name);
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
                  .set({
                    name: newName,
                  })
                  .then(() => {
                    console.debug('Name changed to ' + newName);
                  });
              }}>
              <Text style={styles.buttonTextStyle}>Apply</Text>
            </TouchableOpacity>
          </View>
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
