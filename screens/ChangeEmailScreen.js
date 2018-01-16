import React, { Component } from 'react';
import {
  Platform,
  View,
  Text,
  Alert,
  FlatList,
  TextInput,
  TouchableHighlight,
} from 'react-native';

import PrimaryButton from 'components/forms/PrimaryButton';
import CancelButton from 'components/forms/CancelButton';
import Form from 'components/forms/Form';
import TextInputContainer from 'components/forms/TextInputContainer';
import colors from 'constants/colors';

class ChangeEmailScreen extends Component {
  inputs = [];

  focusNextField(key) {
    this.inputs[key].focus();
  }

  render() {
    return (
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
          Change Email
        </Text>
        <Form>
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
              placeholder="Current Password"
              returnKeyType="done"
              onSubmitEditing={this.handleOnPress}
              onChangeText={password => this.setState({ password })}
            />
          </TextInputContainer>
          <PrimaryButton
            onPress={this.handleSubscribe}
            label="Change Email"
            loading={false}
            disabled={true}
          />
          <CancelButton
            onPress={_ => this.props.navigation.goBack()}
            label="Cancel"
            loading={false}
          />
        </Form>
      </View>
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

export default ChangeEmailScreen;
