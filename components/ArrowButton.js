import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import colors from 'constants/colors';
import { Ionicons } from '@expo/vector-icons';

const ArrowButton = ({ direction, label, onPress }) => {
  const left = direction === 'left';
  const right = direction === 'right';
  const icon = left ? 'ios-arrow-back' : 'ios-arrow-forward';
  const fontSize = 14;
  const textStyle = {
    paddingLeft: left ? 3 : 0,
    paddingRight: right ? 3 : 0,
    color: colors.links,
    fontFamily: 'Verdana',
    fontSize,
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {left && <Ionicons color={colors.links} name={icon} size={fontSize} />}
        <Text style={textStyle}>{label}</Text>
        {right && <Ionicons color={colors.links} name={icon} size={fontSize} />}
      </View>
    </TouchableOpacity>
  );
};

export default ArrowButton;
