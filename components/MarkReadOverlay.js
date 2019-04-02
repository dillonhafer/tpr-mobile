import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

const MarkReadOverlay = ({
  onAbovePress,
  onBelowPress,
  hide,
  aboveHeight,
  belowHeight,
  itemHeight,
}) => {
  return (
    <TouchableWithoutFeedback onPress={hide}>
      <View style={StyleSheet.absoluteFillObject}>
        <View
          style={{
            height: aboveHeight,
            backgroundColor: '#00000099',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <TouchableOpacity onPress={onAbovePress}>
            <View style={styles.button}>
              <Ionicons color="#00000099" name="ios-arrow-dropup" size={20} />
              <Text style={styles.buttonText}>Mark All Above as Read</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ height: itemHeight }} />
        <View
          style={{
            flex: 1,
            height: belowHeight,
            backgroundColor: '#00000099',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <TouchableOpacity onPress={onBelowPress}>
            <View style={styles.button}>
              <Ionicons color="#00000099" name="ios-arrow-dropdown" size={20} />
              <Text style={styles.buttonText}>Mark All Below as Read</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    marginLeft: 10,
    fontWeight: '500',
    fontSize: 18,
    color: '#00000099',
  },
});

// with React 16.6
// export default React.memo(MarkReadOverlay);
export default MarkReadOverlay;
