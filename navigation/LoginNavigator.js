import React from 'react';
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
    return (
      <LoginStackNavigator
        screenProps={{ parentNavigation: this.props.navigation }}
      />
    );
  }
}
