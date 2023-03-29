import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  useColorScheme,
  View,
  TextInput as BasicTextInput,
  Pressable,
} from 'react-native';
import {MD3DarkTheme, MD3LightTheme, Text, TextInput} from 'react-native-paper';

import {RootStackParamList} from '../../App';
import Loader from '../../Component/Loader';
import {registerBasic} from '../../auth';
import {useAppDispatch, useAppSelector} from '../../state';
import {selectUser, setAuthProvider} from '../../state/features/userSlice';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {AuthStackParamList} from './Auth';
import Section from '../../Component/Section';
import styles from '../../styles';
import {SafeAreaView} from 'react-native-safe-area-context';

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
      }
      setErrortext('');

      return () => undefined;
    }, [user.authProvider]),
  );

  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode
      ? MD3DarkTheme.colors.background
      : MD3LightTheme.colors.background,
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

  const handleSubmitButton = () => {
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
    <SafeAreaView style={backgroundStyle}>
      <Loader loading={loading} />
      <KeyboardAvoidingView enabled>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{
            ...backgroundStyle,
            backgroundColor: isDarkMode
              ? MD3DarkTheme.colors.background
              : MD3LightTheme.colors.background,
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
          <Section title="Register">
            <TextInput
              ref={fieldData['email']?.ref}
              onChangeText={fieldData['email']?.set}
              onSubmitEditing={nextActiveField}
              placeholder="Enter Email" //dummy@abc.com
              placeholderTextColor="#8b9cb5"
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
              underlineColorAndroid="#f000"
              onFocus={() => setActiveField('email')}
              mode={activeField === 'email' ? 'outlined' : 'flat'}
            />
            <TextInput
              ref={fieldData['password']?.ref}
              onChangeText={fieldData['password']?.set}
              placeholder="Enter Password" //12345
              placeholderTextColor="#8b9cb5"
              keyboardType="default"
              onSubmitEditing={handleSubmitButton}
              secureTextEntry={true}
              underlineColorAndroid="#f000"
              returnKeyType="next"
              onFocus={() => setActiveField('password')}
              mode={activeField === 'password' ? 'outlined' : 'flat'}
            />
            {errortext != '' ? (
              <Text style={styles.errorTextStyle}> {errortext} </Text>
            ) : null}
            <Pressable style={styles.buttonStyle} onPress={handleSubmitButton}>
              {({pressed}) => (
                <Text
                  style={
                    pressed ? styles.buttonTextStyle : styles.buttonTextStyle
                  }>
                  REGISTER
                </Text>
              )}
            </Pressable>
          </Section>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default RegisterScreen;
