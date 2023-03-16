import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
  TextInput as BasicTextInput,
} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';

import {RootStackParamList} from '../../App';
import Loader from '../../Component/Loader';
import {loginBasic, onGoogleButtonPress, onFBLoginFinished} from '../../auth';
import {GoogleSigninButton} from '@react-native-google-signin/google-signin';
import {useAppDispatch, useAppSelector} from '../../state';
import {selectUser, setAuthProvider} from '../../state/features/userSlice';
import {LoginButton} from 'react-native-fbsdk-next';
import {AuthProvider, withMsg} from '../../state/types/user';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {AuthStackParamList} from './Auth';
import styles from '../../styles';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Section from '../../Component/Section';

const LoginScreen = ({
  navigation,
}: CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList, 'LoginScreen'>,
  NativeStackScreenProps<RootStackParamList>
>) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const isDarkMode = useColorScheme() === 'dark';

  // const refEmail = React.createRef<BasicTextInput>();
  // const refPassword = React.createRef<BasicTextInput>();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const fields = ['email', 'password'] as const;
  type Field = (typeof fields)[number];
  const [activeField, setActiveField] = useState<Field>(fields[0]);
  type FieldData = {
    [key in Field]?: {
      ref: React.RefObject<BasicTextInput>;
      get: () => string;
      set: (value: string) => void;
    };
  };
  const fieldData: FieldData = (() => {
    // const [userEmail, setUserEmail] = useState('');
    // const [userPassword, setUserPassword] = useState('');

    return fields.reduce<FieldData>((acc, field) => {
      const [value, setValue] = useState<string>('');
      acc[field] = {
        ref: React.createRef<BasicTextInput>(),
        get: () => value,
        set: value => setValue(value),
      };
      return acc;
    }, {});
  })();
  const nextActiveField = () => {
    fieldData[activeField]?.ref.current?.blur();
    setActiveField(fields[(fields.indexOf(activeField) + 1) % fields.length]);
  };

  useEffect(() => {
    fieldData[activeField]?.ref.current?.focus();
  }, [activeField]);

  useFocusEffect(
    React.useCallback(() => {
      if (['None', 'Pending'].indexOf(user.authProvider) === -1) {
        navigation.navigate('Chat', {screen: 'SettingsScreen'});
        console.debug('Forced to leave login screen');
      }
      setErrortext('');

      return () => undefined;
    }, [user.authProvider]),
  );

  const loginDecorator: (
    login: (...args: any[]) => Promise<withMsg<AuthProvider>>,
  ) => (...args: any[]) => void =
    login =>
    async (...args: any[]) => {
      dispatch(setAuthProvider('Pending'));
      const [provider, msg] = await login.apply(args);
      if (msg) setErrortext(msg);
      dispatch(setAuthProvider(provider));
    };

  // const [userEmail, setUserEmail] = useState('');
  // const [userPassword, setUserPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');

  const handleSubmitPress = () => {
    setErrortext('');
    setLoading(true);
    loginBasic(
      fieldData['email']?.get() || '',
      fieldData['password']?.get() || '',
    ).then(value => {
      const [provider, msg] = value;
      if (msg) setErrortext(msg);
      dispatch(setAuthProvider(provider));
      setLoading(false);
    });
  };

  return (
    <View style={{...styles.mainBody, ...backgroundStyle}}>
      <Loader loading={loading} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        {/* <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}> */}
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
        <KeyboardAvoidingView enabled>
          <View
            style={{
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }}>
            {/* <View style={{alignItems: 'center'}}>
              <Image
                source={require('../../image/logo.png')}
                style={{
                  width: '50%',
                  height: 100,
                  resizeMode: 'contain',
                  margin: 30,
                }}
              />
            </View> */}
            {/* <View style={styles.SectionStyle}> */}
            <Section title="Login">
              <TextInput
                style={styles.inputStyle}
                ref={fieldData['email']?.ref}
                onChangeText={fieldData['email']?.set}
                placeholder="Enter Email" //dummy@abc.com
                placeholderTextColor="#8b9cb5"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
              {/* </View>
            <View style={styles.SectionStyle}> */}
              <TextInput
                style={styles.inputStyle}
                ref={fieldData['password']?.ref}
                onChangeText={fieldData['password']?.set}
                placeholder="Enter Password" //12345
                placeholderTextColor="#8b9cb5"
                keyboardType="default"
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                secureTextEntry={true}
                underlineColorAndroid="#f000"
                returnKeyType="next"
              />
              {/* </View> */}
              {/* <View> */}
              <GoogleSigninButton
                style={{width: 192, height: 48}}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={loginDecorator(onGoogleButtonPress)}
                disabled={user.authProvider !== 'None'}
              />
              {/* </View>
        <View> */}
              {user.authProvider === 'None' ? (
                <LoginButton
                  permissions={['public_profile', 'email']}
                  onLoginFinished={loginDecorator(onFBLoginFinished)}
                />
              ) : (
                <Button disabled>Login in progress...</Button>
              )}
              {/* </View> */}
            </Section>
            {errortext != '' ? (
              <Text style={styles.errorTextStyle}> {errortext} </Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitPress}>
              <Text style={styles.buttonTextStyle} onPress={handleSubmitPress}>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={() => navigation.navigate('RegisterScreen')}>
              <Text style={styles.buttonTextStyle} onPress={() => navigation.navigate('RegisterScreen')}>Register</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        {/* </View> */}
      </ScrollView>
    </View>
  );
};

export default LoginScreen;

// const localStyles = StyleSheet.create({
//   registerTextStyle: {
//     color: '#FFFFFF',
//     textAlign: 'center',
//     fontWeight: 'bold',
//     fontSize: 14,
//     alignSelf: 'center',
//     padding: 10,
//   },
// });
// const styles = StyleSheet.create({
//   mainBody: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: '#307ecc',
//     alignContent: 'center',
//   },
//   SectionStyle: {
//     flexDirection: 'row',
//     height: 40,
//     marginTop: 20,
//     marginLeft: 35,
//     marginRight: 35,
//     margin: 10,
//   },
//   buttonStyle: {
//     backgroundColor: '#7DE24E',
//     borderWidth: 0,
//     color: '#FFFFFF',
//     borderColor: '#7DE24E',
//     height: 40,
//     alignItems: 'center',
//     borderRadius: 30,
//     marginLeft: 35,
//     marginRight: 35,
//     marginTop: 20,
//     marginBottom: 25,
//   },
//   buttonTextStyle: {
//     color: '#FFFFFF',
//     paddingVertical: 10,
//     fontSize: 16,
//   },
//   inputStyle: {
//     flex: 1,
//     color: 'white',
//     paddingLeft: 15,
//     paddingRight: 15,
//     borderWidth: 1,
//     borderRadius: 30,
//     borderColor: '#dadae8',
//   },
//   registerTextStyle: {
//     color: '#FFFFFF',
//     textAlign: 'center',
//     fontWeight: 'bold',
//     fontSize: 14,
//     alignSelf: 'center',
//     padding: 10,
//   },
//   errorTextStyle: {
//     color: 'red',
//     textAlign: 'center',
//     fontSize: 14,
//   },
// });
