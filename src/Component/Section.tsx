import React from 'react';
import type {PropsWithChildren} from 'react';
import {Text, useColorScheme, View} from 'react-native';
import styles from '../styles';

const Section = ({children, title}: PropsWithChildren<{title: string}>) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View
      style={{
        ...styles.sectionContainer,
        ...styles.sectionCenter,
      }}>
      <Text
        style={[
          styles.sectionTitle,
          isDarkMode ? styles.sectionDark : styles.sectionLight,
        ]}>
        {title}
      </Text>
      <View
        style={{
          ...styles.sectionDescription,
          ...(isDarkMode ? styles.sectionDark : styles.sectionLight),
          ...styles.sectionCenter,
        }}>
        {children}
      </View>
    </View>
  );
};

export default Section;
