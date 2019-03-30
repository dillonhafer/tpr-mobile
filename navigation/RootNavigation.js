import React from "react";
import { createSwitchNavigator, createAppContainer } from "react-navigation";

import MainTabNavigator from "./MainTabNavigator";
import LoginNavigator from "./LoginNavigator";
import AccountNavigator from "./AccountNavigator";

const RootStackNavigator = createAppContainer(
  createSwitchNavigator(
    {
      Login: {
        screen: LoginNavigator
      },
      Main: {
        screen: MainTabNavigator
      },
      Account: {
        screen: AccountNavigator
      }
    },
    {
      navigationOptions: () => ({
        gesturesEnabled: false,
        headerTitleStyle: {
          fontWeight: "normal"
        }
      })
    }
  )
);

export default class RootNavigator extends React.Component {
  static router = RootStackNavigator.router;

  render() {
    return <RootStackNavigator navigation={this.props.navigation} />;
  }
}
