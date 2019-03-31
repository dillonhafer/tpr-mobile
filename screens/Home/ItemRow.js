import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableHighlight } from "react-native";
import colors from "constants/colors";
import { WebBrowser } from "expo";
import moment from "moment";

class ItemRow extends Component {
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
      <TouchableHighlight
        underlayColor={colors.background}
        onPress={this.handleOnPress}
        onLongPress={this.handleOnLongPress}
      >
        <View key={item.title} style={styles.itemRow}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>
            {moment(item.publication_time * 1000).format(
              "MMMM Do, YYYY - h:mm a"
            )}
          </Text>
          <Text style={styles.feed}>{item.feed_name}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "Verdana",
    color: colors.links,
    fontWeight: "700"
  },
  itemRow: {
    padding: 10
  },
  date: {
    fontFamily: "Verdana",
    color: colors.primary,
    fontSize: 11
  },
  feed: {
    fontFamily: "Verdana",
    color: colors.primary,
    fontSize: 11
  }
});

export default ItemRow;
