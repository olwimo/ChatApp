import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  Button,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {RootStackParamList} from '../../App';
import Loader from '../../Component/Loader';
import {loginBasic, onGoogleButtonPress, onFBLoginFinished} from '../../auth';
import {GoogleSigninButton} from '@react-native-google-signin/google-signin';
import {useAppDispatch, useAppSelector} from '../../state';
import {selectUser, setAuthProvider} from '../../state/features/userSlice';
import {LoginButton} from 'react-native-fbsdk-next';
import {AuthProvider, withMsg} from '../../state/types/user';
import { useFocusEffect } from '@react-navigation/native';

const LoginScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'LoginScreen'>) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  useFocusEffect(
    React.useCallback(() => {
      if (user.authProvider !== 'None') navigation.navigate('DrawerNavigationRoutes');
      return () => undefined;
    }, [user.authProvider])
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

  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');

  const handleSubmitPress = () => {
    setErrortext('');
    setLoading(true);
    loginBasic(userEmail, userPassword).then(value => {
      const [provider, msg] = value;
      if (msg) setErrortext(msg);
      dispatch(setAuthProvider(provider));
      setLoading(false);
    });
  };

  return (
    <View style={styles.mainBody}>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View>
          <KeyboardAvoidingView enabled>
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
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={UserEmail => setUserEmail(UserEmail)}
                placeholder="Enter Email" //dummy@abc.com
                placeholderTextColor="#8b9cb5"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={UserPassword => setUserPassword(UserPassword)}
                placeholder="Enter Password" //12345
                placeholderTextColor="#8b9cb5"
                keyboardType="default"
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                secureTextEntry={true}
                underlineColorAndroid="#f000"
                returnKeyType="next"
              />
            </View>
            {errortext != '' ? (
              <Text style={styles.errorTextStyle}> {errortext} </Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitPress}>
              <Text style={styles.buttonTextStyle}>LOGIN</Text>
            </TouchableOpacity>
            <Text
              style={styles.registerTextStyle}
              onPress={() => navigation.navigate('RegisterScreen')}>
              New Here ? Register
            </Text>
          </KeyboardAvoidingView>
        </View>
        <View>
          <GoogleSigninButton
            style={{width: 192, height: 48}}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={loginDecorator(onGoogleButtonPress)
              /*
dispatch(setAuthProvider('Pending'));
    onGoogleButtonPress().then(value => {
      const [provider, msg] = value;
      if (msg) setErrortext(msg);
      dispatch(setAuthProvider(provider));
    });
  }
 */
            }
            disabled={user.authProvider !== 'None'}
          />
        </View>
        <View>
          {user.authProvider === 'None' ? (
            <LoginButton
              permissions={['public_profile', 'email']}
              onLoginFinished={
                loginDecorator(onFBLoginFinished)
                //   (error, result) => {
                //   dispatch(setAuthProvider('Pending'));
                //   onFBLoginFinished(error, result).then(value => {
                //     const [provider, msg] = value;
                //     if (msg) setErrortext(msg);
                //     dispatch(setAuthProvider(provider));
                //   });
                // }
              }
            />
          ) : (
            <Button title="Login in progress..." disabled />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#307ecc',
    alignContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
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
    color: 'white',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#dadae8',
  },
  registerTextStyle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
});
