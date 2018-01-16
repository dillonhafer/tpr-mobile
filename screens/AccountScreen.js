import React from 'react';
import {
  Platform,
  View,
  Text,
  Alert,
  FlatList,
  TouchableHighlight,
} from 'react-native';

// Redux
import { connect } from 'react-redux';
import { updateCurrentUser } from 'actions/users';

// Components
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from 'components/forms/PrimaryButton';
import { notice } from 'notify';
import colors from 'constants/colors';

import { SignOutRequest } from 'api/sessions';
import { GetAccountRequest } from 'api/users';
import {
  RemoveAuthentication,
  GetAuthenticationToken,
} from 'utils/authentication';

class AccountScreen extends React.Component {
  state = {
    loading: false,
    user: {
      name: '',
      email: '',
    },
  };

  componentDidMount() {
    this.fetchCurrentUserEmail();
  }

  fetchCurrentUserEmail = async () => {
    const resp = await GetAccountRequest();
    if (resp && resp.ok) {
      this.setState({
        user: {
          name: resp.name,
          email: resp.email,
        },
      });
    }
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

  renderHeader = () => {
    const { user } = this.state;
    const iconName = Platform.OS === 'ios' ? 'ios-contact' : 'md-contact';
    return (
      <View>
        <View style={styles.userContainer}>
          <Ionicons name={iconName} style={styles.userIcon} />
          <Text style={styles.username}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
        {this.renderSeparator()}
      </View>
    );
  };

  renderFooter = () => {
    const { loading } = this.state;
    return (
      <View>
        {this.renderSeparator()}
        <View style={{ padding: 20 }}>
          <PrimaryButton
            onPress={this.confirmSignOut}
            label="Logout"
            loading={loading}
          />
        </View>
      </View>
    );
  };

  renderItem = ({ item }) => {
    const iconName =
      Platform.OS === 'ios' ? 'ios-arrow-forward' : 'md-arrow-round-forward';
    return (
      <TouchableHighlight
        underlayColor={colors.background}
        onPress={_ => this.props.navigation.navigate(item.key)}
      >
        <View key={item.title} style={styles.itemRow}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingRight: 10,
            }}
          >
            <Text style={styles.itemText}>{item.key}</Text>
            <Ionicons
              name={iconName}
              size={24}
              style={{ color: colors.links }}
            />
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: colors.primary,
        }}
      />
    );
  };

  render() {
    const { loading, user } = this.state;
    const items = [
      { key: 'Change Email' },
      {
        key: 'Change Password',
      },
    ];
    return (
      <View style={styles.container}>
        <FlatList
          contentInset={{ top: 42 }}
          contentOffset={{ y: -42 }}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
          data={items}
          ItemSeparatorComponent={this.renderSeparator}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  userContainer: {
    padding: 20,
    paddingTop: 0,
  },
  username: {
    fontFamily: 'Verdana',
    textAlign: 'center',
    color: colors.links,
    fontSize: 22,
  },
  email: {
    fontFamily: 'Verdana',
    textAlign: 'center',
    color: colors.tabIconDefault,
    fontSize: 14,
  },
  itemText: {
    fontFamily: 'Verdana',
    color: colors.links,
    fontWeight: '700',
  },
  itemRow: {
    padding: 10,
  },
  userIcon: {
    marginBottom: -3,
    fontSize: 68,
    textAlign: 'center',
    color: colors.primary,
  },
};

export default connect(null, dispatch => ({
  updateCurrentUser: user => {
    dispatch(updateCurrentUser(user));
  },
}))(AccountScreen);
