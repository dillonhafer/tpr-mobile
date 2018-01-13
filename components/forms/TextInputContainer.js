import React, { Component } from 'react';
import { View } from 'react-native';
import colors from 'constants/colors';

const inputContainer = {
  backgroundColor: '#fff',
  borderWidth: 2,
  borderRadius: 5,
  borderColor: colors.primary,
  height: 35,
  padding: 5,
  justifyContent: 'center',
  marginBottom: 10,
};

class TextInputContainer extends Component {
  render() {
    return <View style={inputContainer}>{this.props.children}</View>;
  }
}

export default TextInputContainer;
