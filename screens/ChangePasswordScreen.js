import React, { Component } from 'react';
import { View, Text, TextInput, SafeAreaView } from 'react-native';

import PrimaryButton from 'components/forms/PrimaryButton';
import CancelButton from 'components/forms/CancelButton';
import Form from 'components/forms/Form';
import TextInputContainer from 'components/forms/TextInputContainer';
import colors from 'constants/colors';
import Device from 'utils/Device';
const isTablet = Device.isTablet();

class ChangePasswordScreen extends Component {
  inputs = [];

  focusNextField(key) {
    this.inputs[key].focus();
  }

  render() {
    return (
      <SafeAreaView style={{ backgroundColor: '#7ab0b2', flex: 1 }}>
        <View style={styles.container}>
          <Text
            style={{
              fontSize: 16,
              color: colors.primary,
              textAlign: 'center',
              fontFamily: 'Verdana',
              marginBottom: 10,
            }}
          >
            Change Password
          </Text>
          <Form>
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
                onSubmitEditing={() => {
                  this.focusNextField('passwordConfirmation');
                }}
                returnKeyType="next"
                placeholder="New Password"
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
                onSubmitEditing={() => {
                  this.focusNextField('currentPassword');
                }}
                placeholder="Password Confirmation"
                returnKeyType="next"
                onChangeText={passwordConfirmation =>
                  this.setState({ passwordConfirmation })
                }
              />
            </TextInputContainer>
            <TextInputContainer>
              <TextInput
                placeholder="Current Password"
                autoCapitalize={'none'}
                underlineColorAndroid={'transparent'}
                autoCorrect={false}
                secureTextEntry={true}
                onSubmitEditing={this.handleSubscribe}
                ref={input => {
                  this.inputs['currentPassword'] = input;
                }}
                returnKeyType="done"
                enablesReturnKeyAutomatically={true}
                onChangeText={url =>
                  this.setState({
                    url,
                  })
                }
              />
            </TextInputContainer>
            <PrimaryButton
              onPress={this.handleSubscribe}
              label="Change Password"
              loading={false}
              disabled={true}
            />
            {!isTablet && (
              <CancelButton
                onPress={() => this.props.navigation.goBack()}
                label="Cancel"
                loading={false}
              />
            )}
          </Form>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
};

export default ChangePasswordScreen;
