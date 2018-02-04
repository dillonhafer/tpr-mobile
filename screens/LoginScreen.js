import React, { Component } from 'react';
import {
  LayoutAnimation,
  Keyboard,
  ActivityIndicator,
  Image,
  StyleSheet,
  Platform,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';

// Redux
import { connect } from 'react-redux';
import { updateDomain } from 'actions/appConfig';
import { updateCurrentUser } from 'actions/users';

import colors from 'constants/colors';
import logo from 'images/book.png';
import { GetDomain, GetCurrentUser } from 'utils/authentication';
import DomainSettings from 'components/DomainSettings';
import LoginTabNavigator from 'navigation/LoginTabNavigator';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class LoginScreen extends Component {
  state = {
    checking: true,
  };

  componentDidMount() {
    this.checkDomain();
    this.checkCurrentUser();
  }

  checkDomain = async _ => {
    const domain = await GetDomain();
    this.props.updateDomain(domain);
  };

  checkCurrentUser = async _ => {
    try {
      const user = await GetCurrentUser();
      const isAuthenticated = user && user.name.length > 0;
      if (isAuthenticated) {
        setTimeout(Keyboard.dismiss, 500);
        this.props.updateCurrentUser(user);
        this.props.screenProps.parentNavigation.navigate('Main');
      } else {
        this.setState({ checking: false });
      }
    } catch (err) {
      console.log(err);
      this.setState({ checking: false });
    }
  };

  render() {
    const hasDomain = this.props.domain && this.props.domain.length > 0;

    if (this.state.checking) {
      return null;
    }

    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && (
          <KeyboardAwareScrollView scrollEnabled={false}>
            <View style={styles.logoContainer}>
              <Image style={styles.logo} source={logo} />
              <Text style={styles.logoText}>The Pithy Reader</Text>
            </View>
            <TouchableOpacity onPress={_ => this.props.updateDomain('')}>
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
            {hasDomain ? (
              <LoginTabNavigator screenProps={this.props.screenProps} />
            ) : (
              <DomainSettings />
            )}
          </KeyboardAwareScrollView>
        )}

        {Platform.OS !== 'ios' && [
          <View key="1" style={styles.logoContainer}>
            <Image style={styles.logo} source={logo} />
            <Text style={styles.logoText}>The Pithy Reader</Text>
          </View>,
          <TouchableOpacity key="1" onPress={_ => this.props.updateDomain('')}>
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
          hasDomain ? (
            <LoginTabNavigator key="4" screenProps={this.props.screenProps} />
          ) : (
            <DomainSettings key="4" />
          ),
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
)(LoginScreen);
