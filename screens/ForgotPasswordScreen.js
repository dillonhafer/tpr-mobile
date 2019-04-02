import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import ArrowButton from 'components/ArrowButton';
import colors from 'constants/colors';
import PrimaryButton from 'components/forms/PrimaryButton';
import Form from 'components/forms/Form';
import TextInputContainer from 'components/forms/TextInputContainer';

import { validEmail } from 'utils/helpers';
import { RequestPasswordResetRequest } from 'api/users';
import { notice, error } from 'notify';
import Device from 'utils/Device';
const isTablet = Device.isTablet();

export default class SignInScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  inputs = [];

  state = {
    email: '',
    loading: false,
  };

  validateFields = () => {
    const { email } = this.state;
    return email.length > 0 && validEmail(email);
  };

  requestPasswordReset = async () => {
    const { email } = this.state;
    await RequestPasswordResetRequest({ email });
    notice('Please check your email for reset information');
    this.props.navigation.navigate('SignIn');
  };

  handleOnPress = async () => {
    this.setState({ loading: true });
    try {
      if (this.validateFields()) {
        await this.requestPasswordReset();
      } else {
        error('Email is invalid');
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
    const { loading } = this.state;
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
                onChangeText={email => this.setState({ email })}
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
            onPress={() => this.props.navigation.navigate('SignIn')}
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
    justifyContent: 'flex-end',
  },
});
