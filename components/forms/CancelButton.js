import React, { PureComponent } from 'react';
import {
  LayoutAnimation,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from 'constants/colors';

class CancelButton extends PureComponent {
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  render() {
    const { label, onPress, disabled, loading } = this.props;
    const _disabled = disabled || loading;
    return (
      <TouchableOpacity disabled={_disabled} onPress={onPress}>
        <View
          style={{
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderRadius: 5,
            borderColor: 'transparent',
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
              color={colors.primary}
            />
          </View>
          <Text
            style={{
              fontFamily: 'Verdana',
              textAlign: 'center',
              color: colors.primary,
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

export default CancelButton;
