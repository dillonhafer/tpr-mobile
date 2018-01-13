import React from 'react';
import { StatusBar } from 'react-native';
import { StackNavigator } from 'react-navigation';
import LoginScreen from 'screens/LoginScreen';

const LoginStackNavigator = StackNavigator(
  {
    Login: {
      screen: LoginScreen,
    },
  },
  {
    headerMode: 'none',
    navigationOptions: {
      gesturesEnabled: false,
    },
  },
);

export default class LoginNavigator extends React.Component {
  render() {
    StatusBar.setBarStyle('light-content');
    return (
      <LoginStackNavigator
        screenProps={{ parentNavigation: this.props.navigation }}
      />
    );
  }
}
