import React, { Component } from 'react';
import { Text } from 'react-native';
import colors from 'constants/colors';

class Label extends Component {
  render() {
    return (
      <Text
        style={{
          color: colors.primary,
          textAlign: this.props.align || 'left',
        }}
      >
        {this.props.label}
      </Text>
    );
  }
}

export default Label;
