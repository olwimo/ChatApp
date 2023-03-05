import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {StackParamList} from './DrawerNavigationRoutes';

const HomeScreen = (
  _props: NativeStackScreenProps<StackParamList, 'HomeScreen'>,
) => {
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
            This is the Home Screen
          </Text>
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

export default HomeScreen;
