import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  Platform,
  PlatformColor,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

const Section = ({children, title}: PropsWithChildren<{title: string}>) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          isDarkMode ? styles.sectionDark : styles.sectionLight,
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          isDarkMode ? styles.sectionDark : styles.sectionLight,
        ]}>
        {children}
      </Text>
    </View>
  );
};

export default Section;

const styles = StyleSheet.create({
  sectionDark: {
    ...Platform.select({
      ios: {
        color: PlatformColor('darkText'),
      },
      android: {
        color: PlatformColor('@android:color/primary_text_dark'),
      },
      default: {
        color: 'white',
      },
    }),
  },
  sectionLight: {
    ...Platform.select({
      ios: {
        color: PlatformColor('lightText'),
      },
      android: {
        color: PlatformColor('@android:color/primary_text_light'),
      },
      default: {
        color: 'black',
      },
    }),
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});
