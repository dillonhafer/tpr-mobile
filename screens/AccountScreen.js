import React from 'react';
import { View, Text, Alert } from 'react-native';

// Redux
import { connect } from 'react-redux';
import { updateCurrentUser } from 'actions/users';

import PrimaryButton from 'components/forms/PrimaryButton';
import { notice } from 'notify';

import { SignOutRequest } from 'api/sessions';
import {
  RemoveAuthentication,
  GetAuthenticationToken,
} from 'utils/authentication';

class AccountScreen extends React.Component {
  state = {
    loading: false,
  };

  confirmSignOut = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: this.signOut,
        },
      ],
      { cancelable: true },
    );
  };

  signOut = async () => {
    try {
      this.setState({ loading: true });
      const sessionToken = await GetAuthenticationToken();
      await SignOutRequest(sessionToken);
      RemoveAuthentication();
      this.props.updateCurrentUser({ name: '' });
      notice('You are now logged out');
      this.props.screenProps.parentNavigation.navigate('Login');
    } catch (err) {
      console.log('logout error', err);
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { loading } = this.state;
    return (
      <View style={styles.container}>
        <PrimaryButton
          onPress={this.confirmSignOut}
          label="Logout"
          loading={loading}
        />
      </View>
    );
  }
}

const styles = {
  container: {
    padding: 20,
    paddingTop: 44,
  },
};

export default connect(null, dispatch => ({
  updateCurrentUser: user => {
    dispatch(updateCurrentUser(user));
  },
}))(AccountScreen);
