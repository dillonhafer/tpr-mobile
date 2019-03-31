import React, { Component, PureComponent } from "react";
import {
  StyleSheet,
  Text,
  View,
  RefreshControl,
  SafeAreaView,
  FlatList
} from "react-native";

import { ArchivedItemsRequest } from "api/items";
import colors from "constants/colors";
import { values } from "lodash";
import moment from "moment";
import ItemRow from "screens/Home/ItemRow";

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
    return <ItemRow item={item} />;
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

  renderEmpty = () => {
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
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <FlatList
            ListEmptyComponent={this.renderFooter}
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
      </SafeAreaView>
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
