import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Button,
  TouchableHighlight,
  View,
  RefreshControl,
  FlatList,
  Alert,
} from 'react-native';

import {
  UnreadItemsRequest,
  MarkItemReadRequest,
  MarkAllReadRequest,
} from 'api/items';
import { WebBrowser } from 'expo';
import colors from 'constants/colors';
import PrimaryButton from 'components/forms/PrimaryButton';
import { values } from 'lodash';
import moment from 'moment';

export default class HomeScreen extends React.Component {
  state = {
    refreshing: false,
    lastRefreshDate: moment(),
    markAllReadLoading: false,
    items: [],
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

  renderItem = ({ item }) => {
    return (
      <TouchableHighlight
        underlayColor={colors.background}
        onPress={_ => this.handleOnPress(item)}
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
    );
  };

  markAllRead = () => {
    const itemIDs = this.state.items.map(i => i.id);
    this.setState({ items: [] });
    MarkAllReadRequest({ itemIDs });
  };

  renderHeader = length => {
    if (this.state.items.length > 0) {
      const { markAllReadLoading } = this.state;
      return (
        <View style={{ padding: 20, paddingTop: 40, alignItems: 'center' }}>
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

  renderFooter = () => {
    if (this.state.items.length === 0) {
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
            {this.state.lastRefreshDate.format('MMMM Do, YYYY, h:mm a')}.
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
          keyExtractor={i => i.id}
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
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
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
