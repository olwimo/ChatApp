import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
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
import {SafeAreaView} from 'react-native-safe-area-context';

const LoginScreen = ({
  navigation,
}: CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList, 'LoginScreen'>,
  NativeStackScreenProps<RootStackParamList>
>) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const isDarkMode = useColorScheme() === 'dark';

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
    <SafeAreaView style={backgroundStyle}>
      <Loader loading={loading} />
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
          <Section title="Login:">
            <TextInput
              style={styles.inputStyle}
              ref={fieldData['email']?.ref}
              onChangeText={fieldData['email']?.set}
              onSubmitEditing={nextActiveField}
              placeholder="Enter Email" //dummy@abc.com
              placeholderTextColor="#8b9cb5"
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
              underlineColorAndroid="#f000"
              blurOnSubmit={false}
            />
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
            {errortext != '' ? (
              <Text style={styles.errorTextStyle}> {errortext} </Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitPress}>
              <Text style={styles.buttonTextStyle} onPress={handleSubmitPress}>
                LOGIN
              </Text>
            </TouchableOpacity>
          </Section>
          <Section title="Providers:">
            <GoogleSigninButton
              style={{width: 192, height: 48}}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={loginDecorator(onGoogleButtonPress)}
              disabled={user.authProvider !== 'None'}
            />
            {user.authProvider === 'None' ? (
              <LoginButton
                permissions={['public_profile', 'email']}
                onLoginFinished={loginDecorator(onFBLoginFinished)}
              />
            ) : (
              <Button style={{width: 192, height: 48}} disabled>
                Login in progress...
              </Button>
            )}
          </Section>
          <Section title="Create account:">
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={() => navigation.navigate('RegisterScreen')}>
              <Text
                style={styles.buttonTextStyle}
                onPress={() => navigation.navigate('RegisterScreen')}>
                Register
              </Text>
            </TouchableOpacity>
          </Section>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
