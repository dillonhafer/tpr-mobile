import React from 'react';
import {
  StyleSheet,
  Text,
  LayoutAnimation,
  SafeAreaView,
  View,
  RefreshControl,
  FlatList,
} from 'react-native';

import {
  UnreadItemsRequest,
  MarkItemReadRequest,
  MarkAllReadRequest,
} from 'api/items';
import * as WebBrowser from 'expo-web-browser';
import colors from 'constants/colors';
import PrimaryButton from 'components/forms/PrimaryButton';
import { values, orderBy } from 'lodash';
import moment from 'moment';
import MarkReadOverlay from 'components/MarkReadOverlay';
import ItemRow from 'components/ItemRow';

export default class HomeScreen extends React.Component {
  itemRefs = [];
  container = null;
  state = {
    refreshing: false,
    lastRefreshDate: moment(),
    markAllReadLoading: false,
    markReadModal: {
      aboveHeight: 0,
      belowHeight: 0,
      rowHeight: 0,
      visible: false,
    },
  };

  componentDidMount() {
    if (this.props.items.length === 0) {
      this.onRefresh();
    }
  }

  getUnreadItems = () => {
    return UnreadItemsRequest().then((resp) => {
      if (resp.ok) {
        const items = orderBy(
          values(resp).slice(0, -1),
          ['publication_time'],
          ['desc'],
        );
        this.props.updateItems(items);
      }
    });
  };

  handleOnPress = (item) => {
    WebBrowser.openBrowserAsync(item.url).then(() => {
      MarkItemReadRequest(item.id).then(() => {
        this.props.removeItem(item);
      });
    });
  };

  showMarkSomeReadModal = (index) => {
    // this.itemRefs[index].measure((fx, fy, width, height, px, py) => {
    // this.container.measure((_, __, ___, ____, _____, safeViewHeight) => {
    //   this.setState({
    //     markReadModal: {
    //       index,
    //       aboveHeight: py - safeViewHeight,
    //       belowHeight: 1000,
    //       height,
    //       visible: true,
    //     },
    //   });
    //   LayoutAnimation.easeInEaseOut();
    // });
    // });
  };

  renderItem = ({ item, index }) => {
    return (
      <View
        ref={(ref) => {
          this.itemRefs[index] = ref;
        }}
      >
        <ItemRow
          onPress={this.handleOnPress}
          onLongPress={this.showMarkSomeReadModal}
          item={item}
          index={index}
        />
      </View>
    );
  };

  markAllRead = () => {
    const itemIDs = this.props.items.map((i) => i.id);
    MarkAllReadRequest({ itemIDs }).then(() => {
      this.props.removeItems(itemIDs);
    });
  };

  markAboveRead = () => {
    const index = this.state.markReadModal.index;
    const aboveIDs = this.props.items
      .filter((i, idx) => idx < index)
      .map((i) => i.id);

    MarkAllReadRequest({ itemIDs: aboveIDs }).then(() => {
      this.props.removeItems(aboveIDs);
    });

    this.setState({
      markReadModal: {
        index: -1,
        height: 0,
        aboveHeight: 0,
        belowHeight: 0,
        visible: false,
      },
    });
  };

  markBelowRead = () => {
    const index = this.state.markReadModal.index;
    const belowIDs = this.props.items
      .filter((i, idx) => idx > index)
      .map((i) => i.id);
    MarkAllReadRequest({ itemIDs: belowIDs }).then(() => {
      this.props.removeItems(belowIDs);
    });

    this.setState({
      markReadModal: {
        index: -1,
        height: 0,
        aboveHeight: 0,
        belowHeight: 0,
        visible: false,
      },
    });
  };

  renderHeader = () => {
    if (this.props.items.length > 0) {
      const { markAllReadLoading } = this.state;
      return (
        <View style={{ padding: 20, alignItems: 'center' }}>
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
          width: '100%',
          backgroundColor: colors.primary,
        }}
      />
    );
  };

  renderEmpty = () => {
    return (
      <View style={{ padding: 30, marginTop: 30 }}>
        <Text
          style={{
            textAlign: 'center',
            fontFamily: 'Verdana',
            color: colors.primary,
          }}
        >
          No unread items as of{' '}
          {this.props.lastRefreshDate.format('MMMM Do, YYYY, h:mm a')}.
        </Text>
      </View>
    );
  };

  onRefresh = async () => {
    this.setState({ refreshing: true });
    this.getUnreadItems()
      .then(() => {
        this.setState({ refreshing: false });
      })
      .catch(() => {
        this.setState({ refreshing: false });
      });
  };

  render() {
    const { refreshing } = this.state;
    const { items } = this.props;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          ref={(con) => {
            this.container = con;
          }}
          style={styles.container}
        >
          <FlatList
            scrollEnabled={!this.state.markReadModal.visible}
            ListHeaderComponent={this.renderHeader}
            ListEmptyComponent={this.renderEmpty}
            refreshControl={
              <RefreshControl
                tintColor={colors.primary}
                refreshing={refreshing}
                onRefresh={this.onRefresh}
              />
            }
            style={styles.list}
            data={items}
            keyExtractor={(i) => String(i.id)}
            ItemSeparatorComponent={this.renderSeparator}
            renderItem={this.renderItem}
          />
          {this.state.markReadModal.visible && (
            <MarkReadOverlay
              onAbovePress={this.markAboveRead}
              onBelowPress={this.markBelowRead}
              hide={() => {
                this.setState({ markReadModal: { visible: false } });
                LayoutAnimation.easeInEaseOut();
              }}
              aboveHeight={this.state.markReadModal.aboveHeight}
              belowHeight={this.state.markReadModal.belowHeight}
              itemHeight={this.state.markReadModal.height}
            />
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
