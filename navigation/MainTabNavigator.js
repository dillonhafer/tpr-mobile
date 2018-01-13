import React from 'react';
import { Platform, View, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigator, TabBarBottom } from 'react-navigation';

import Colors from 'constants/colors';

import HomeScreen from 'screens/HomeScreen';
import ArchiveScreen from 'screens/ArchiveScreen';
import FeedsScreen from 'screens/FeedsScreen';
import AccountScreen from 'screens/AccountScreen';

const MainTabTabNavigator = TabNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Archive: {
      screen: ArchiveScreen,
    },
    Feeds: {
      screen: FeedsScreen,
    },
    Account: {
      screen: AccountScreen,
    },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case 'Home':
            iconName =
              Platform.OS === 'ios'
                ? `ios-home${focused ? '' : '-outline'}`
                : 'md-home';
            break;
          case 'Archive':
            iconName =
              Platform.OS === 'ios'
                ? `ios-archive${focused ? '' : '-outline'}`
                : 'md-archive';
            break;
          case 'Feeds':
            iconName =
              Platform.OS === 'ios'
                ? `ios-albums${focused ? '' : '-outline'}`
                : 'md-albums';
            break;
          case 'Account':
            iconName =
              Platform.OS === 'ios'
                ? `ios-contact${focused ? '' : '-outline'}`
                : 'md-contact';
        }
        return (
          <Ionicons
            name={iconName}
            size={28}
            style={{ marginBottom: -3 }}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        );
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  },
);

export default class MainTabNavigator extends React.Component {
  render() {
    StatusBar.setBarStyle('default');
    return (
      <MainTabTabNavigator
        screenProps={{ parentNavigation: this.props.navigation }}
      />
    );
  }
}
