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
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize={'none'}
                underlineColorAndroid={'transparent'}
                autoCorrect={false}
                onSubmitEditing={this.handleOnPress}
                returnKeyType="done"
                enablesReturnKeyAutomatically={true}
                onChangeText={name => this.setState({ name })}
              />
            </TextInputContainer>

            <PrimaryButton
              label="Reset Password"
              onPress={this.handleOnPress}
              loading={loading}
              disabled={!valid}
            />
          </Form>
        </View>

        <View style={styles.buttonContainer}>
          <ArrowButton
            label="Login"
            direction="right"
            onPress={_ => this.props.navigation.navigate('SignIn')}
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
    justifyContent: 'flex-end',
  },
});
