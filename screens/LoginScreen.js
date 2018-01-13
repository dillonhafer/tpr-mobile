import React, { Component } from 'react';
import {
  LayoutAnimation,
  ActivityIndicator,
  Image,
  StyleSheet,
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

class LoginScreen extends Component {
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
        this.props.updateCurrentUser(user);
        this.props.screenProps.parentNavigation.navigate('Main');
      }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const hasDomain = this.props.domain && this.props.domain.length > 0;
    return (
      <View style={styles.container}>
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
