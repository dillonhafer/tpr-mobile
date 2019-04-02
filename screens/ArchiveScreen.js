import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  RefreshControl,
  SafeAreaView,
  FlatList,
} from 'react-native';

import { ArchivedItemsRequest } from 'api/items';
import colors from 'constants/colors';
import { values } from 'lodash';
import moment from 'moment';
import ItemRow from 'components/ItemRow';

export default class ArchiveScreen extends Component {
  state = {
    refreshing: false,
    items: [],
  };

  componentDidMount() {
    this.getArchivedItems();
  }

  getArchivedItems = () => {
    return ArchivedItemsRequest().then(resp => {
      if (resp.ok) {
        const items = values(resp)
          .slice(0, -1)
          .slice(0, 100)
          .map(item => {
            return {
              key: String(item.id),
              ...item,
            };
          });
        this.setState({ items });
      }
    });
  };

  renderItem = ({ item }) => {
    return <ItemRow item={item} />;
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
          No archived items as of {moment().format('MMMM Do, YYYY, h:mm a')}.
        </Text>
      </View>
    );
  };

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.getArchivedItems()
      .then(() => {
        this.setState({ refreshing: false });
      })
      .catch(() => {
        this.setState({ refreshing: false });
      });
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
    backgroundColor: '#fff',
  },
});
