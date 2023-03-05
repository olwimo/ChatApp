import React from 'react';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {Image, TouchableOpacity, View} from 'react-native';
import {DrawerStackParamList} from '../Screen/DrawerNavigationRoutes';

const NavigationDrawerHeader = (props: {
  navigationProps: DrawerNavigationProp<DrawerStackParamList>;
}) => {
  const toggleDrawer = () => {
    props.navigationProps.toggleDrawer();
  };

  return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity onPress={toggleDrawer}>
        <Image
          source={require('../image/drawerWhite.png')}
          style={{width: 25, height: 25, marginLeft: 5}}
        />
      </TouchableOpacity>
    </View>
  );
};

export default NavigationDrawerHeader;
