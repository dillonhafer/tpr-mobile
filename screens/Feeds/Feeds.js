import React from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  View,
  Text,
  RefreshControl,
  LayoutAnimation,
  FlatList,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  Share,
} from 'react-native';

import {
  AllFeedsRequest,
  SubscribeFeedRequest,
  UnsubscribeFeedRequest,
  ImportFeedRequest,
} from 'api/feeds';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import colors from 'constants/colors';
import { notice, error } from 'notify';
import { GetExportURL } from 'utils/authentication';
import PrimaryButton from 'components/forms/PrimaryButton';
import { values, groupBy } from 'lodash';
import Form from 'components/forms/Form';
import TextInputContainer from 'components/forms/TextInputContainer';
import Device from 'utils/Device';
const isTablet = Device.isTablet();
import FeedItemRow from 'components/FeedItemRow';
import Ionicons from '@expo/vector-icons/Ionicons';

export default class SettingsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Feeds',
      headerRight: isTablet ? null : (
        <TouchableOpacity
          onPress={navigation.getParam('toggleImportExport', () => {})}
        >
          <Ionicons
            style={{ paddingHorizontal: 25 }}
            name="ios-cloud-upload"
            size={28}
            color="#fff"
          />
        </TouchableOpacity>
      ),
    };
  };

  state = {
    refreshing: false,
    feeds: [],
    url: '',
    exportLoading: false,
    importLoading: false,
    showImportExport: isTablet,
  };

  inputs = [];

  componentDidMount() {
    this.props.navigation.setParams({
      toggleImportExport: this.toggleImportExport,
    });

    if (this.props.feeds.length === 0) {
      this.onRefresh();
    }
  }

  toggleImportExport = () => {
    LayoutAnimation.easeInEaseOut();
    this.setState({
      showImportExport: !this.state.showImportExport,
    });
  };

  getFeeds = async () => {
    AllFeedsRequest().then(resp => {
      if (resp.ok) {
        const feeds = values(resp).slice(0, -1);
        this.props.updateFeeds(feeds);
      }
    });
  };

  importXML = async () => {
    this.setState({ importLoading: true });
    try {
      const type = Platform.OS === 'ios' ? 'application/xml' : '*/*';
      const file = await DocumentPicker.getDocumentAsync({ type });
      if (file.type === 'success') {
        let data = new FormData();
        data.append('file', {
          uri: file.uri,
          name: file.name,
          type: 'multipart/form-data',
        });
        const resp = await ImportFeedRequest(data);
        if (resp && resp.ok) {
          this.getFeeds();
          notice('Imported OPML');
        } else {
          throw 'api error';
        }
      }
    } catch (err) {
      error('Something went wrong');
    } finally {
      this.setState({ importLoading: false });
    }
  };

  exportXML = async () => {
    this.setState({ exportLoading: true });
    try {
      const exportURL = await GetExportURL();
      const resp = await FileSystem.downloadAsync(
        exportURL,
        FileSystem.documentDirectory + 'tpr-opml-export.xml',
      );
      if (resp.status === 200) {
        if (Platform.OS === 'ios') {
          await Share.share({ title: 'Export OPML File', url: resp.uri });
        }
      } else {
        error(
          `${resp.status} Could not export. Your session may have expired.`,
        );
      }
    } catch (err) {
      error('Something went wrong');
    } finally {
      this.setState({ exportLoading: false });
    }
  };

  confirmUnsubscribe = feedID => {
    Alert.alert(
      'Unsubscribe',
      'Are you sure you want to unsubscribe?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Unsubscribe',
          style: 'destructive',
          onPress: async () => {
            await this.handleUnsubscribe(feedID);
          },
        },
      ],
      { cancelable: true },
    );
  };

  handleUnsubscribe = async feedID => {
    UnsubscribeFeedRequest(feedID).then(resp => {
      if (resp.ok) {
        this.props.removeFeed({ feed_id: feedID });
      }
    });
  };

  handleSubscribe = async () => {
    if (this.state.url.length) {
      const resp = await SubscribeFeedRequest({ url: this.state.url });
      if (resp && resp.ok) {
        this.setState({ url: '' });
        this.inputs['url'].clear();
        this.getFeeds();
      }
    }
  };

  handleOnPress = feed => {
    this.props.navigation.navigate('FeedScreen', {
      feedName: feed.name,
      feedID: feed.feed_id,
    });
  };

  renderItem = ({ item: feed }) => {
    return (
      <FeedItemRow
        unreadCount={
          this.itemCounts[feed.feed_id]
            ? this.itemCounts[feed.feed_id].length
            : 0
        }
        onPress={this.handleOnPress}
        feed={feed}
        onUnsubscribe={this.confirmUnsubscribe}
      />
    );
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

  onRefresh = async () => {
    this.setState({ refreshing: true });
    this.getFeeds()
      .then(() => {
        this.setState({ refreshing: false });
      })
      .catch(() => {
        this.setState({ refreshing: false });
      });
  };

  renderFeedManager = () => {
    const { exportLoading, importLoading, showImportExport } = this.state;

    return (
      <View style={{ ...(showImportExport ? {} : { height: 0 }) }}>
        <Form>
          <TextInputContainer>
            <TextInput
              placeholder="Feed URL"
              autoCapitalize={'none'}
              underlineColorAndroid={'transparent'}
              autoCorrect={false}
              keyboardType="url"
              onSubmitEditing={this.handleSubscribe}
              ref={input => {
                this.inputs['url'] = input;
              }}
              returnKeyType="done"
              enablesReturnKeyAutomatically={true}
              onChangeText={url =>
                this.setState({
                  url,
                })
              }
            />
          </TextInputContainer>
          <PrimaryButton
            onPress={this.handleSubscribe}
            disabled={!this.state.url.length}
            label="Subscribe"
            loading={false}
          />
        </Form>
        <View style={{ height: 0.5, backgroundColor: colors.primary }} />
        <Form>
          <PrimaryButton
            onPress={this.importXML}
            label={'Import OPML File'}
            loading={importLoading}
          />
        </Form>
        <View style={{ height: 0.5, backgroundColor: colors.primary }} />
        <Form>
          <PrimaryButton
            onPress={this.exportXML}
            label={'Export OPML File'}
            loading={exportLoading}
          />
        </Form>
      </View>
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
          You have no feed subscriptions
        </Text>
      </View>
    );
  };

  renderFeedList = () => {
    const { refreshing } = this.state;
    const { feeds } = this.props;

    return (
      <FlatList
        refreshControl={
          <RefreshControl
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={this.onRefresh}
          />
        }
        style={styles.list}
        data={feeds}
        keyExtractor={i => String(i.feed_id)}
        ItemSeparatorComponent={this.renderSeparator}
        renderItem={this.renderItem}
        ListEmptyComponent={this.renderEmpty()}
      />
    );
  };

  itemCounts = {};
  getItemCounts = () => {
    this.itemCounts = groupBy(this.props.items, 'feed_id');
  };

  render() {
    this.getItemCounts();
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.mainContainer}>{this.renderFeedManager()}</View>
        <View style={styles.feedListContainer}>{this.renderFeedList()}</View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    flexDirection: isTablet ? 'row' : 'column',
  },
  mainContainer: {
    backgroundColor: '#fff',
    flex: isTablet ? 1 : -1,
    maxWidth: isTablet ? '35%' : '100%',
  },
  feedListContainer: {
    flex: 1,
    backgroundColor: '#fff',
    ...(isTablet
      ? {
          borderWidth: 0.5, // eslint-disable-line
          borderColor: 'transparent', // eslint-disable-line
          borderLeftColor: colors.primary, // eslint-disable-line
        } // eslint-disable-line
      : {}),
  },
});
