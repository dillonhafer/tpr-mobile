import React from "react";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  createBottomTabNavigator as TabNavigator,
  TabBarBottom
} from "react-navigation";
import Device from "utils/Device";

import colors from "constants/colors";

import HomeScreen from "screens/Home";
import ArchiveScreen from "screens/ArchiveScreen";
import FeedsScreen from "screens/FeedsScreen";
import AccountNavigator from "navigation/AccountNavigator";

const MainTabTabNavigator = TabNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Archive: {
      screen: ArchiveScreen
    },
    Feeds: {
      screen: FeedsScreen
    },
    Account: {
      screen: AccountNavigator
    }
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case "Home":
            iconName = Platform.OS === "ios" ? `ios-home` : "md-home";
            break;
          case "Archive":
            iconName = Platform.OS === "ios" ? `ios-archive` : "md-archive";
            break;
          case "Feeds":
            iconName = Platform.OS === "ios" ? `ios-albums` : "md-albums";
            break;
          case "Account":
            iconName = Platform.OS === "ios" ? `ios-contact` : "md-contact";
        }
        return (
          <Ionicons
            name={iconName}
            size={28}
            color={focused ? colors.tabIconSelected : colors.background}
          />
        );
      }
    }),
    tabBarComponent: TabBarBottom,
    swipeEnabled: false,
    tabBarOptions: {
      activeTintColor: colors.tabIconSelected,
      inactiveTintColor: colors.background,
      style: {
        backgroundColor: colors.primary,
        ...(Device.isTablet() ? { height: 48 } : {})
      }
    }
  }
);

export default class MainTabNavigator extends React.Component {
  static router = MainTabTabNavigator.router;

  render() {
    return (
      <MainTabTabNavigator
        navigation={this.props.navigation}
        screenProps={{ parentNavigation: this.props.navigation }}
      />
    );
  }
}
