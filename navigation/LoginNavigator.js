import React from 'react';
import {
  Image,
  TouchableOpacity,
  Text,
  Platform,
  View,
  StyleSheet,
} from 'react-native';
import { createSwitchNavigator } from 'react-navigation';
import colors from 'constants/colors';

import ForgotPasswordScreen from 'screens/ForgotPasswordScreen';
import SignInScreen from 'screens/SignInScreen';
import RegisterScreen from 'screens/RegisterScreen';
import DomainSettings from 'components/DomainSettings';

import logo from 'assets/images/book.png';

import { connect } from 'react-redux';
import { updateDomain } from 'actions/appConfig';
import { updateCurrentUser } from 'actions/users';

const What = createSwitchNavigator(
  {
    DomainSetting: {
      screen: DomainSettings,
    },
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

class TabNavigator extends React.Component {
  static router = What.router;

  componentDidMount() {
    if (this.props.domain.length > 0) {
      this.props.navigation.navigate('SignIn');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && (
          <View style={{ flex: 1 }}>
            <View style={styles.logoContainer}>
              <Image style={styles.logo} source={logo} />
              <Text style={styles.logoText}>The Pithy Reader</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('DomainSetting');
              }}
            >
              <Text
                style={{
                  fontFamily: 'Verdana',
                  color: colors.background,
                  textAlign: 'center',
                }}
              >
                {this.props.domain}
              </Text>
            </TouchableOpacity>
            <View style={{ height: 20 }} />
            <What
              navigation={this.props.navigation}
              screenProps={{ parentNavigation: this.props.navigation }}
            />
          </View>
        )}

        {Platform.OS !== 'ios' && [
          <View key="1" style={styles.logoContainer}>
            <Image style={styles.logo} source={logo} />
            <Text style={styles.logoText}>The Pithy Reader</Text>
          </View>,
          <TouchableOpacity key="1" onPress={() => this.props.updateDomain('')}>
            <Text
              style={{
                fontFamily: 'Verdana',
                color: colors.background,
                textAlign: 'center',
              }}
            >
              {this.props.domain}
            </Text>
          </TouchableOpacity>,
          <View key="3" style={{ height: 20 }} />,
          <What
            key="whatnav2"
            navigation={this.props.navigation}
            screenProps={{ parentNavigation: this.props.navigation }}
          />,
        ]}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 40,
  },
  logoText: {
    fontFamily: 'Verdana',
    fontWeight: '700',
    color: colors.background,
    fontSize: 22,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});

export default connect(
  state => ({ domain: state.appConfig.domain }),
  dispatch => ({
    updateDomain: domain => {
      dispatch(updateDomain(domain));
    },
    updateCurrentUser: user => {
      dispatch(updateCurrentUser(user));
    },
  }),
)(TabNavigator);
