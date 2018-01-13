import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigator, TabBarBottom } from 'react-navigation';

import Colors from 'constants/colors';

import ForgotPasswordScreen from 'screens/ForgotPasswordScreen';
import SignInScreen from 'screens/SignInScreen';
import RegisterScreen from 'screens/RegisterScreen';

export default TabNavigator(
  {
    ForgotPassword: {
      screen: ForgotPasswordScreen,
    },
    SignIn: {
      screen: SignInScreen,
    },
    Register: {
      screen: RegisterScreen,
    },
  },
  {
    initialRouteName: 'SignIn',
    animationEnabled: true,
    swipeEnabled: true,
    tabBarOptions: {
      labelStyle: {
        fontSize: 1,
      },
      style: {
        opacity: 0,
        height: 0,
      },
    },
  },
);
