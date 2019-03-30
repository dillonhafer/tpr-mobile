import React, { Component, PureComponent } from "react";
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  RefreshControl,
  FlatList
} from "react-native";

import { ArchivedItemsRequest } from "api/items";
import { WebBrowser } from "expo";
import colors from "constants/colors";
import { values } from "lodash";
import moment from "moment";

class ArchiveItem extends PureComponent {
  handleOnPress = async () => {
    WebBrowser.openBrowserAsync(this.props.item.url);
  };

  render() {
    const { item } = this.props;
    return (
      <TouchableHighlight
        underlayColor={colors.background}
        onPress={this.handleOnPress}
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

export default class ArchiveScreen extends Component {
  state = {
    refreshing: false,
    items: []
  };

  componentDidMount() {
    this.getArchivedItems();
  }

  getArchivedItems = async () => {
    const resp = await ArchivedItemsRequest();
    if (resp && resp.ok) {
      const items = values(resp)
        .slice(0, -1)
        .slice(0, 100)
        .map(item => {
          return {
            key: String(item.id),
            ...item
          };
        });
      this.setState({ items });
    }
  };

  renderItem = ({ item }) => {
    return <ArchiveItem item={item} />;
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: colors.primary
        }}
      />
    );
  };

  renderFooter = () => {
    if (this.state.items.length === 0) {
      return (
        <View style={{ padding: 30, marginTop: 30 }}>
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Verdana",
              color: colors.primary
            }}
          >
            No archived items as of {moment().format("MMMM Do, YYYY, h:mm a")}.
          </Text>
        </View>
      );
    } else {
      return null;
    }
  };

  onRefresh = async () => {
    this.setState({ refreshing: true });
    try {
      await this.getArchivedItems();
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ refreshing: false });
    }
  };

  render() {
    const { refreshing, items } = this.state;
    return (
      <View style={styles.container}>
        <FlatList
          contentInset={{ top: 22 }}
          contentOffset={{ y: -22 }}
          ListHeaderComponent={() => <View style={{ height: 30 }} />}
          ListFooterComponent={this.renderFooter}
          refreshControl={
            <RefreshControl
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />
          }
          style={styles.list}
          data={items}
          ItemSeparatorComponent={this.renderSeparator}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center"
  },
  contentContainer: {
    paddingTop: 30
  },
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
