import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import colors from 'constants/colors';
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
        backgroundColor: colors.errorBackground,
        paddingHorizontal: 25,
      }}
    >
      <Ionicons name={'ios-trash'} color="#fff" size={36} />
    </View>
  </TouchableHighlight>,
];

class ItemRow extends Component {
  swiper = null;

  handleOnUnsubscribe = () => {
    this.swiper.recenter();
    this.props.onUnsubscribe(this.props.feed.feed_id);
  };

  handleOnPress = () => {
    if (this.swiper.state.rightButtonsOpen) {
      this.swiper.recenter();
    } else {
      this.props.onPress(this.props.feed);
    }
  };

  render() {
    const { feed } = this.props;
    return (
      <Swipeable
        ref={ref => {
          this.swiper = ref;
        }}
        rightButtons={rightButtons(this.handleOnUnsubscribe)}
      >
        <View>
          <TouchableHighlight
            underlayColor={colors.background}
            onPress={this.handleOnPress}
          >
            <View style={styles.itemRow}>
              <Text style={styles.title}>
                {feed.name} ({this.props.unreadCount} unread)
              </Text>
              <Text style={styles.url}>{feed.url}</Text>
              {feed.last_publication_time && (
                <Text style={styles.date}>
                  Last published{' '}
                  {moment(feed.last_publication_time * 1000).format(
                    'MMMM Do, YYYY - h:mm a',
                  )}
                </Text>
              )}
              {feed.last_failure && (
                <Text style={styles.feedFailure}>{feed.last_failure}</Text>
              )}
            </View>
          </TouchableHighlight>
        </View>
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
    fontSize: 13,
  },
  url: {
    fontFamily: 'Verdana',
    color: '#777',
    fontSize: 11,
    paddingVertical: 5,
  },
  feedFailure: {
    fontFamily: 'Verdana',
    color: colors.errorBackground,
    fontSize: 11,
  },
});

export default ItemRow;
