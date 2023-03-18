import React, {PropsWithChildren, useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  ViewStyle,
  NativeModules,
} from 'react-native';
import {useHeaderHeight} from '@react-navigation/elements';

const CustomKeyboardAvoidingView = ({
  children,
  style
}: PropsWithChildren<{style?: StyleProp<ViewStyle>}>) => {
  const headerHeight = useHeaderHeight();
//   const [height, setHeight] = useState<number>(
//     Platform.OS === 'ios' ? 20 : NativeModules.StatusBarManager.HEIGHT,
//   );

//   useEffect(() => {
//     if (Platform.OS === 'ios') {
//       NativeModules.StatusBarManager.getHeight((statusBarHeight: number) => {
//         setHeight(statusBarHeight);
//       });
//     }
//   }, []);

  return (
    <KeyboardAvoidingView
      style={style}
      behavior="padding"
      keyboardVerticalOffset={headerHeight / 2}
       enabled
      >
      {children}
    </KeyboardAvoidingView>
  );
};

export default CustomKeyboardAvoidingView;
