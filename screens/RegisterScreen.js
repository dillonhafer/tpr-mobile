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

import ArrowButton from 'components/ArrowButton';
import colors from 'constants/colors';
import PrimaryButton from 'components/forms/PrimaryButton';
import Form from 'components/forms/Form';
import TextInputContainer from 'components/forms/TextInputContainer';

export default class SignInScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  inputs = [];

  state = {
    name: '',
    password: '',
    loading: false,
  };

  validateFields = () => {
    const { name, password } = this.state;
    return name.length > 0 && password.length > 0;
  };

  signIn = async () => {
    const { name, password } = this.state;
    const resp = await SignInRequest({ name, password });
    console.log(resp);
    if (resp && resp.ok) {
      SetAuthenticationToken(resp.sessionID);
      this.props.updateCurrentUser(resp.name);
      SetCurrentUser(resp.name);
      // navigateHome(this.props.navigation.dispatch);
      Alert.alert('You are now signed in!');
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
      // console.log(err)
    } finally {
      this.setState({ loading: false });
    }
  };

  focusNextField(key) {
    this.inputs[key].focus();
  }

  render() {
    const { name, password, loading } = this.state;
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
                onChangeText={name => this.setState({ name })}
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
                enablesReturnKeyAutomatically={true}
                onChangeText={name => this.setState({ name })}
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
                onChangeText={password => this.setState({ password })}
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
  },
});
