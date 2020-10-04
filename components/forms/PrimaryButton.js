import React, { PureComponent } from 'react';
import {
  LayoutAnimation,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from 'constants/colors';

class PrimaryButton extends PureComponent {
  render() {
    const { label, onPress, disabled, loading } = this.props;
    const _disabled = disabled || loading;
    return (
      <TouchableOpacity disabled={_disabled} onPress={onPress}>
        <View
          style={{
            backgroundColor: colors.primary,
            borderWidth: 1,
            borderRadius: 5,
            borderColor: colors.primary,
            padding: 8,
            opacity: _disabled ? 0.4 : 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View style={{ marginLeft: -20 }}>
            <ActivityIndicator
              hideWhenStopped={true}
              animating={loading}
              color={colors.background}
            />
          </View>
          <Text
            style={{
              fontFamily: 'Verdana',
              textAlign: 'center',
              color: colors.background,
              marginLeft: loading ? 5 : 0,
            }}
          >
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default PrimaryButton;
