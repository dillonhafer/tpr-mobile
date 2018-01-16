import React from 'react';
import { StackNavigator } from 'react-navigation';
import AccountScreen from 'screens/AccountScreen';
import ChangeEmailScreen from 'screens/ChangeEmailScreen';
import ChangePasswordScreen from 'screens/ChangePasswordScreen';

const AccountNavigator = StackNavigator(
  {
    Account: {
      screen: AccountScreen,
    },
    'Change Email': {
      screen: ChangeEmailScreen,
    },
    'Change Password': {
      screen: ChangePasswordScreen,
    },
  },
  {
    headerMode: 'none',
    navigationOptions: {
      gesturesEnabled: true,
    },
  },
);

export default AccountNavigator;
