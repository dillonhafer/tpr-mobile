import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';

import { RegisterRequest } from 'api/users';
import { notice } from 'notify';
import ArrowButton from 'components/ArrowButton';
import colors from 'constants/colors';
import PrimaryButton from 'components/forms/PrimaryButton';
import Form from 'components/forms/Form';
import TextInputContainer from 'components/forms/TextInputContainer';
import { validEmail } from 'utils/helpers';
import { SetAuthenticationToken, SetCurrentUser } from 'utils/authentication';

export default class SignInScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  inputs = [];

  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    loading: false,
  };

  validateFields = () => {
    const { username, email, password, passwordConfirmation } = this.state;
    return (
      username.length > 0 &&
      username.length <= 30 &&
      (email.length > 0 ? validEmail(email) : true) &&
      password.length > 7 &&
      password === passwordConfirmation
    );
  };

  register = async () => {
    const { username, email, password } = this.state;

    let params = {
      name: username,
      password,
    };
    if (email.length > 0 && validEmail(email)) {
      params.email = email;
    }

    const resp = await RegisterRequest(params);
    if (resp && resp.ok) {
      SetAuthenticationToken(resp.sessionID);
      SetCurrentUser({ name: resp.name });
      this.props.updateCurrentUser({ name: resp.name });

      notice('Welcome to The Pithy Reader!');
      this.props.screenProps.parentNavigation.navigate('Main');
    }
  };

  handleOnPress = async () => {
    this.setState({ loading: true });
    try {
      if (this.validateFields()) {
        await this.register();
      } else {
        error('Name/Password are invalid');
      }
    } catch (err) {
      // console.log(err)
    } finally {
      this.setState({ loading: false });
    }
  };

  focusNextField(key) {
    this.inputs[key].focus();
  }

  render() {
    const { username, email, password, loading } = this.state;
    const valid = this.validateFields();
    return (
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Form>
            <TextInputContainer>
              <TextInput
                style={{ height: 50 }}
                placeholder="User name"
                autoCapitalize={'none'}
                underlineColorAndroid={'transparent'}
                autoCorrect={false}
                ref={input => {
                  this.inputs['username'] = input;
                }}
                onSubmitEditing={_ => {
                  this.focusNextField('email');
                }}
                returnKeyType="next"
                enablesReturnKeyAutomatically={true}
                onChangeText={username => this.setState({ username })}
              />
            </TextInputContainer>
            <TextInputContainer>
              <TextInput
                style={{ height: 50 }}
                placeholder="Email (optional)"
                autoCapitalize={'none'}
                keyboardType="email-address"
                underlineColorAndroid={'transparent'}
                autoCorrect={false}
                ref={input => {
                  this.inputs['email'] = input;
                }}
                onSubmitEditing={_ => {
                  this.focusNextField('password');
                }}
                returnKeyType="next"
                enablesReturnKeyAutomatically={false}
                onChangeText={email => this.setState({ email })}
              />
            </TextInputContainer>
            <TextInputContainer>
              <TextInput
                style={{ height: 50 }}
                enablesReturnKeyAutomatically={true}
                secureTextEntry={true}
                autoCapitalize={'none'}
                underlineColorAndroid={'transparent'}
                ref={input => {
                  this.inputs['password'] = input;
                }}
                onSubmitEditing={_ => {
                  this.focusNextField('passwordConfirmation');
                }}
                placeholder="Password"
                returnKeyType="next"
                onChangeText={password => this.setState({ password })}
              />
            </TextInputContainer>
            <TextInputContainer>
              <TextInput
                style={{ height: 50 }}
                enablesReturnKeyAutomatically={true}
                secureTextEntry={true}
                autoCapitalize={'none'}
                underlineColorAndroid={'transparent'}
                ref={input => {
                  this.inputs['passwordConfirmation'] = input;
                }}
                placeholder="Password Confirmation"
                returnKeyType="done"
                onSubmitEditing={this.handleOnPress}
                onChangeText={passwordConfirmation =>
                  this.setState({ passwordConfirmation })}
              />
            </TextInputContainer>
            <PrimaryButton
              label="Register"
              onPress={this.handleOnPress}
              loading={loading}
              disabled={!valid}
            />
          </Form>
        </View>
        <View style={styles.buttonContainer}>
          <ArrowButton
            onPress={_ => this.props.navigation.navigate('SignIn')}
            direction="left"
            label="Login"
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
    marginBottom: 20,
  },
});
