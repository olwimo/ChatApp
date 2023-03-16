import React, {Component, useEffect, useRef, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  Image,
  // Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  useColorScheme,
  View,
  TextInput as BasicTextInput,
} from 'react-native';
import {Text, TextInput} from 'react-native-paper';

import {TouchableOpacity} from 'react-native-gesture-handler';

import {RootStackParamList} from '../../App';
import Loader from '../../Component/Loader';
import {registerBasic} from '../../auth';
import {useAppDispatch, useAppSelector} from '../../state';
import {selectUser, setAuthProvider} from '../../state/features/userSlice';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {AuthStackParamList} from './Auth';
import Section from '../../Component/Section';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import styles from '../../styles';

const RegisterScreen = ({
  navigation,
}: CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList, 'RegisterScreen'>,
  NativeStackScreenProps<RootStackParamList>
>) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  useFocusEffect(
    React.useCallback(() => {
      if (['None', 'Pending'].indexOf(user.authProvider) === -1) {
        navigation.navigate('Chat', {screen: 'SettingsScreen'});
        console.debug('Forced to leave register screen');
      }
      setErrortext('');

      return () => undefined;
    }, [user.authProvider]),
  );

  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');

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

  //       return {
  //     'email': {
  //       ref: React.createRef<BasicTextInput>(),
  //       get: () => userEmail,
  //       set: setUserEmail,
  //     },
  //     'password': {
  //       ref: React.createRef<BasicTextInput>(),
  //       get: () => userPassword,
  //       set: setUserPassword,
  //     },
  //   }
  // })();

  const handleSubmitButton = () => {
    console.debug('RegisterScreen.tsx: Pressed');
    setErrortext('');
    setLoading(true);
    registerBasic(
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
    // <View style={{flex: 1, backgroundColor: '#307ecc'}}>
    <View style={{...styles.mainBody, ...backgroundStyle}}>
      <Loader loading={loading} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
        // keyboardShouldPersistTaps="handled"
        // contentContainerStyle={{
        //   justifyContent: 'center',
        //   alignContent: 'center',
        // }}
      >
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
            <Section title="Register">
              {/* <View style={styles.SectionStyle}> */}
              <TextInput
                autoFocus={true}
                style={styles.inputStyle}
                ref={fieldData['email']?.ref}
                onChangeText={fieldData['email']?.set}
                underlineColorAndroid="#f000"
                placeholder="Enter Email"
                placeholderTextColor="#8b9cb5"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={nextActiveField}
                mode={activeField === 'email' ? 'outlined' : 'flat'}
                // blurOnSubmit={false}
              />
              {/* </View> */}
              {/* <View style={styles.SectionStyle}> */}
              <TextInput
                style={styles.inputStyle}
                ref={fieldData['password']?.ref}
                onChangeText={fieldData['password']?.set}
                placeholder="Enter Password" //12345
                placeholderTextColor="#8b9cb5"
                keyboardType="default"
                onSubmitEditing={handleSubmitButton}
                mode={activeField === 'password' ? 'outlined' : 'flat'}
                // blurOnSubmit={false}
                secureTextEntry={true}
                underlineColorAndroid="#f000"
                returnKeyType="next"
              />
              {/* </View> */}
            </Section>
            {errortext != '' ? (
              <Text style={styles.errorTextStyle}> {errortext} </Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitButton}>
              <Text
                //  onPress={handleSubmitButton}
                style={styles.buttonTextStyle}>
                REGISTER
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};
export default RegisterScreen;

// const styles = StyleSheet.create({
//   // SectionStyle: {
//   //   flexDirection: 'row',
//   //   height: 40,
//   //   marginTop: 20,
//   //   marginLeft: 35,
//   //   marginRight: 35,
//   //   margin: 10,
//   // },
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
//     marginBottom: 20,
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
//   errorTextStyle: {
//     color: 'red',
//     textAlign: 'center',
//     fontSize: 14,
//   },
//   successTextStyle: {
//     color: 'white',
//     textAlign: 'center',
//     fontSize: 18,
//     padding: 30,
//   },
// });
