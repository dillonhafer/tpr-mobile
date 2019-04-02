import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

// Redux
import { connect } from 'react-redux';
import { updateCurrentUser } from 'actions/users';
import { SignInRequest } from 'api/sessions';

import { notice, error } from 'notify';
import colors from 'constants/colors';
import ArrowButton from 'components/ArrowButton';
import PrimaryButton from 'components/forms/PrimaryButton';
import Form from 'components/forms/Form';
import TextInputContainer from 'components/forms/TextInputContainer';

import { SetAuthenticationToken, SetCurrentUser } from 'utils/authentication';
import Device from 'utils/Device';
const isTablet = Device.isTablet();

class SignInScreen extends React.Component {
  inputs = [];

  state = {
    name: '',
    password: '',
    loading: false,
  };

  componentDidMount() {
    if (this.props.users.currentUser.name.length > 0) {
      this.props.navigation.navigate('Main');
    }
  }

  validateFields = () => {
    const { name, password } = this.state;
    return name.length > 0 && password.length > 0;
  };

  signIn = async () => {
    const { name, password } = this.state;
    const resp = await SignInRequest({ name, password });
    if (resp && resp.ok) {
      SetAuthenticationToken(resp.sessionID);
      SetCurrentUser({ name: resp.name });
      this.props.updateCurrentUser({ name: resp.name });
      notice('You are now signed in!');
      this.setState({ loading: true });
      this.props.screenProps.parentNavigation.navigate('Main');
    } else {
      this.setState({ loading: true });
    }
  };

  handleOnPress = async () => {
    this.setState({ loading: true });
    try {
      if (this.validateFields()) {
        await this.signIn();
      } else {
        error('Name/Password are invalid');
      }
    } catch (err) {
      this.setState({ loading: false });
    }
  };

  focusNextField(key) {
    this.inputs[key].focus();
  }

  handleValueFromPasswordExtension = (field, value) => {
    this.setState({ [field]: value });
    this.inputs[field].setNativeProps({
      text: value,
    });
  };

  getUsernameFromManager = name => {
    this.handleValueFromPasswordExtension('name', name);
  };

  getPasswordFromManager = password => {
    this.handleValueFromPasswordExtension('password', password);
  };

  render() {
    const { loading } = this.state;
    const valid = this.validateFields();

    return (
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Form>
            <TextInputContainer>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <TextInput
                  style={{ height: 50, flex: 1 }}
                  placeholder="User name"
                  autoCapitalize={'none'}
                  underlineColorAndroid={'transparent'}
                  autoCorrect={false}
                  ref={input => {
                    this.inputs['name'] = input;
                  }}
                  onSubmitEditing={() => {
                    this.focusNextField('password');
                  }}
                  returnKeyType="next"
                  textContentType="username"
                  enablesReturnKeyAutomatically={true}
                  onChangeText={name => this.setState({ name })}
                />
              </View>
            </TextInputContainer>
            <TextInputContainer>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <TextInput
                  style={{ height: 50, flex: 1 }}
                  enablesReturnKeyAutomatically={true}
                  secureTextEntry={true}
                  autoCapitalize={'none'}
                  textContentType="password"
                  underlineColorAndroid={'transparent'}
                  ref={input => {
                    this.inputs['password'] = input;
                  }}
                  placeholder="Password"
                  returnKeyType="done"
                  onSubmitEditing={this.handleOnPress}
                  onChangeText={password => this.setState({ password })}
                />
              </View>
            </TextInputContainer>
            <PrimaryButton
              label="Login"
              onPress={this.handleOnPress}
              loading={loading}
              disabled={!valid}
            />
          </Form>
        </View>

        <View style={styles.buttonContainer}>
          <ArrowButton
            onPress={() => this.props.navigation.navigate('ForgotPassword')}
            direction="left"
            label="Forgot Password"
          />
          <ArrowButton
            onPress={() => this.props.navigation.navigate('Register')}
            direction="right"
            label="Register"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingLeft: 20,
    paddingRight: 20,
    ...(isTablet ? { width: 400, alignSelf: 'center' } : {}),
  },
  formContainer: {
    backgroundColor: colors.background,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: colors.background,
    overflow: 'hidden',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default connect(
  state => ({ users: state.users }),
  dispatch => ({
    updateCurrentUser: user => {
      dispatch(updateCurrentUser(user));
    },
  }),
)(SignInScreen);
