import React from "react";
import {
  StyleSheet,
  Text,
  LayoutAnimation,
  View,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import {
  UnreadItemsRequest,
  MarkItemReadRequest,
  MarkAllReadRequest
} from "api/items";
import { WebBrowser } from "expo";
import colors from "constants/colors";
import PrimaryButton from "components/forms/PrimaryButton";
import { values } from "lodash";
import moment from "moment";

export default class HomeScreen extends React.Component {
  state = {
    refreshing: false,
    lastRefreshDate: moment(),
    markAllReadLoading: false,
    items: [],
    markReadModal: {
      aboveHeight: 0,
      belowHeight: 0,
      rowHeight: 0,
      visible: false
    }
  };

  componentDidMount() {
    this.getUnreadItems();
  }

  getUnreadItems = async () => {
    const resp = await UnreadItemsRequest();
    if (resp && resp.ok) {
      const items = values(resp);
      const lastRefreshDate = moment();
      this.setState({ lastRefreshDate, items: items.slice(0, -1) });
    }
  };

  handleOnPress = async item => {
    const items = this.state.items.filter(i => {
      return i.id !== item.id;
    });
    await WebBrowser.openBrowserAsync(item.url);
    this.setState({ items });
    MarkItemReadRequest(item.id);
  };

  itemRefs = [];

  showMarkSomeReadModal = index => {
    this.itemRefs[index].measure((fx, fy, width, height, px, py) => {
      this.setState({
        markReadModal: {
          index,
          aboveHeight: py,
          belowHeight: 1000,
          height,
          visible: true
        }
      });
      LayoutAnimation.easeInEaseOut();
    });
  };

  renderItem = ({ item, index }) => {
    return (
      <TouchableHighlight
        ref={ref => {
          this.itemRefs[index] = ref;
        }}
        underlayColor={colors.background}
        onPress={_ => this.handleOnPress(item)}
        onLongPress={() => {
          this.showMarkSomeReadModal(index);
        }}
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
  };

  markAllRead = () => {
    const itemIDs = this.state.items.map(i => i.id);
    this.setState({ items: [] });
    MarkAllReadRequest({ itemIDs });
  };

  markAboveRead = () => {
    const index = this.state.markReadModal.index;
    const aboveIDs = this.state.items
      .filter((i, idx) => idx < index)
      .map(i => i.id);
    MarkAllReadRequest({ itemIDs: aboveIDs });

    const items = this.state.items.filter((i, idx) => idx >= index);
    this.setState({
      items,
      markReadModal: {
        index: -1,
        height: 0,
        aboveHeight: 0,
        belowHeight: 0,
        visible: false
      }
    });
  };

  markBelowRead = () => {
    const index = this.state.markReadModal.index;
    const belowIDs = this.state.items
      .filter((i, idx) => idx > index)
      .map(i => i.id);
    MarkAllReadRequest({ itemIDs: belowIDs });

    const items = this.state.items.filter((i, idx) => idx <= index);
    this.setState({
      items,
      markReadModal: {
        index: -1,
        height: 0,
        aboveHeight: 0,
        belowHeight: 0,
        visible: false
      }
    });
  };

  renderHeader = length => {
    if (this.state.items.length > 0) {
      const { markAllReadLoading } = this.state;
      return (
        <View style={{ padding: 20, paddingTop: 40, alignItems: "center" }}>
          <PrimaryButton
            loading={markAllReadLoading}
            label="Mark All Read"
            onPress={this.markAllRead}
          />
        </View>
      );
    } else {
      return null;
    }
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
            No unread items as of{" "}
            {this.state.lastRefreshDate.format("MMMM Do, YYYY, h:mm a")}.
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
      await this.getUnreadItems();
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
          ListHeaderComponent={this.renderHeader}
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
          keyExtractor={i => String(i.id)}
          ItemSeparatorComponent={this.renderSeparator}
          renderItem={this.renderItem}
        />
        {this.state.markReadModal.visible && (
          <TouchableWithoutFeedback
            onPress={() => {
              this.setState({ markReadModal: { visible: false } });
            }}
          >
            <View style={StyleSheet.absoluteFillObject}>
              <View
                style={{
                  height: this.state.markReadModal.aboveHeight,
                  backgroundColor: "#00000099",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "flex-end"
                }}
              >
                <TouchableOpacity onPress={this.markAboveRead}>
                  <View
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 5,
                      flexDirection: "row",
                      justifyContent: "center",
                      marginBottom: 10,
                      padding: 10,
                      alignItems: "center"
                    }}
                  >
                    <Ionicons
                      color="#00000099"
                      name="ios-arrow-dropup"
                      size={20}
                    />
                    <Text
                      style={{
                        marginLeft: 10,
                        fontWeight: "500",
                        fontSize: 18,
                        color: "#00000099"
                      }}
                    >
                      Mark All Above as Read
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ height: this.state.markReadModal.height }} />
              <View
                style={{
                  flex: 1,
                  height: this.state.markReadModal.belowHeight,
                  backgroundColor: "#00000099",
                  alignItems: "center",
                  justifyContent: "flex-start"
                }}
              >
                <TouchableOpacity onPress={this.markBelowRead}>
                  <View
                    style={{
                      marginTop: 10,
                      backgroundColor: "#fff",
                      borderRadius: 5,
                      padding: 10,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Ionicons
                      color="#00000099"
                      name="ios-arrow-dropdown"
                      size={20}
                    />
                    <Text
                      style={{
                        marginLeft: 10,
                        fontWeight: "500",
                        fontSize: 18,
                        color: "#00000099"
                      }}
                    >
                      Mark All Below as Read
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
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
