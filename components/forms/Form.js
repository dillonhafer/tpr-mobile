import React, { Component } from 'react';
import { View } from 'react-native';
import colors from 'constants/colors';

class Form extends Component {
  render() {
    return (
      <View
        style={{
          padding: 20,
          backgroundColor: colors.background,
        }}
      >
        {this.props.children}
      </View>
    );
  }
}

export default Form;
