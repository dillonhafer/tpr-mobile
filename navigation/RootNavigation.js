import { Notifications } from "expo";
import React from "react";
import { createSwitchNavigator, createAppContainer } from "react-navigation";

import MainTabNavigator from "./MainTabNavigator";
import LoginNavigator from "./LoginNavigator";
import AccountNavigator from "./AccountNavigator";
import registerForPushNotificationsAsync from "api/registerForPushNotificationsAsync";

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

  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }

  render() {
    return <RootStackNavigator navigation={this.props.navigation} />;
  }

  _registerForPushNotifications() {
    // Send our push token over to our backend so we can receive notifications
    // You can comment the following line out if you want to stop receiving
    // a notification every time you open the app. Check out the source
    // for this function in api/registerForPushNotificationsAsync.js
    registerForPushNotificationsAsync();

    // Watch for incoming notifications
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }

  _handleNotification = ({ origin, data }) => {
    console.log(
      `Push notification ${origin} with data: ${JSON.stringify(data)}`
    );
  };
}
