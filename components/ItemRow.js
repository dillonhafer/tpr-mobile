import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import colors from 'constants/colors';
import { WebBrowser } from 'expo';
import moment from 'moment';

// EXP
import Swipeable from 'react-native-swipeable';
import Ionicons from '@expo/vector-icons/Ionicons';

const rightButtons = onPress => [
  <TouchableHighlight onPress={onPress}>
    <View
      style={{
        justifyContent: 'center',
        height: '100%',
        backgroundColor: colors.primary,
        paddingHorizontal: 20,
      }}
    >
      <Ionicons
        name={'ios-information-circle-outline'}
        color="#fff"
        size={36}
      />
    </View>
  </TouchableHighlight>,
];

class ItemRow extends Component {
  swiper = null;

  handleOnInfo = () => {
    this.swiper.recenter();
  };

  handleOnPress = () => {
    WebBrowser.openBrowserAsync(this.props.item.url);
  };

  handleOnLongPress = () => {
    if (this.props.onLongPress) {
      this.props.onLongPress(this.props.index);
    }
  };

  render() {
    const { item } = this.props;
    return (
      <Swipeable
        ref={ref => {
          this.swiper = ref;
        }}
        // rightButtons={rightButtons(this.handleOnInfo)}
      >
        <TouchableHighlight
          underlayColor={colors.background}
          onPress={this.handleOnPress}
          onLongPress={this.handleOnLongPress}
        >
          <View key={item.title} style={styles.itemRow}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>
              {moment(item.publication_time * 1000).format(
                'MMMM Do, YYYY - h:mm a',
              )}
            </Text>
            <Text style={styles.feed}>{item.feed_name}</Text>
          </View>
        </TouchableHighlight>
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Verdana',
    color: colors.links,
    fontWeight: '700',
  },
  itemRow: {
    padding: 10,
  },
  date: {
    fontFamily: 'Verdana',
    color: colors.primary,
    fontSize: 11,
  },
  feed: {
    fontFamily: 'Verdana',
    color: colors.primary,
    fontSize: 11,
  },
});

export default ItemRow;
