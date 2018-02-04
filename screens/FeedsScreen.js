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
  TouchableOpacity,
  Share,
} from 'react-native';

import {
  AllFeedsRequest,
  SubscribeFeedRequest,
  UnsubscribeFeedRequest,
  ImportFeedRequest,
} from 'api/feeds';
import { WebBrowser, FileSystem, DocumentPicker } from 'expo';
import colors from 'constants/colors';
import { notice, error } from 'notify';
import { GetExportURL } from 'utils/authentication';
import PrimaryButton from 'components/forms/PrimaryButton';
import { values } from 'lodash';
import moment from 'moment';
import Form from 'components/forms/Form';
import TextInputContainer from 'components/forms/TextInputContainer';
import Device from 'utils/Device';
const isTablet = Device.isTablet();

export default class SettingsScreen extends React.Component {
  state = {
    refreshing: false,
    feeds: [],
    url: '',
    exportLoading: false,
    importLoading: false,
  };

  inputs = [];

  componentDidMount() {
    this.getFeeds();
  }

  getFeeds = async () => {
    const resp = await AllFeedsRequest();
    if (resp && resp.ok) {
      const feeds = values(resp);
      this.setState({ feeds: feeds.slice(0, -1) });
    }
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
      } else {
        throw file.type;
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
        FileSystem.documentDirectory + 'tpr-opml.xml',
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
    const resp = await UnsubscribeFeedRequest(feedID);
    if (resp && resp.ok) {
      const feeds = this.state.feeds.filter(feed => feed.feed_id !== feedID);
      this.setState({ feeds });
    }
  };

  handleSubscribe = async () => {
    const resp = await SubscribeFeedRequest({ url: this.state.url });
    if (resp && resp.ok) {
      this.setState({ url: '' });
      this.inputs['url'].clear();
      this.getFeeds();
    }
  };

  handleOnPress = async feed => {
    WebBrowser.openBrowserAsync(feed.url);
  };

  renderItem = ({ item: feed }) => {
    return (
      <View>
        <TouchableHighlight
          underlayColor={colors.background}
          onPress={_ => this.handleOnPress(feed)}
        >
          <View style={styles.itemRow}>
            <Text style={styles.title}>
              {feed.name} ({feed.item_count})
            </Text>
            {feed.last_publication_time && (
              <Text style={styles.date}>
                Last published
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
        <View style={styles.unsubscribeContainer}>
          <TouchableOpacity
            onPress={_ => this.confirmUnsubscribe(feed.feed_id)}
          >
            <Text style={styles.unsubscribe}>Unsubscribe</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    try {
      await this.getFeeds();
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ refreshing: false });
    }
  };

  renderHeader = () => {
    const { exportLoading, importLoading } = this.state;

    return (
      <View style={styles.headerContainer}>
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
                })}
            />
          </TextInputContainer>
          <PrimaryButton
            onPress={this.handleSubscribe}
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

  renderTablet() {
    const { refreshing, feeds } = this.state;
    return (
      <View style={styles.container}>
        <View key="main" style={styles.mainContainer}>
          <FlatList
            contentInset={{ top: 22 }}
            contentOffset={{ y: -22 }}
            ListHeaderComponent={this.renderHeader}
            style={styles.list}
            data={[]}
          />
        </View>
        <View key="side" style={styles.sidebarContainer}>
          <FlatList
            contentInset={{ top: 22 }}
            contentOffset={{ y: -22 }}
            refreshControl={
              <RefreshControl
                tintColor={colors.primary}
                refreshing={refreshing}
                onRefresh={this.onRefresh}
              />
            }
            style={styles.list}
            data={feeds}
            keyExtractor={i => i.feed_id}
            ItemSeparatorComponent={this.renderSeparator}
            renderItem={this.renderItem}
          />
        </View>
      </View>
    );
  }

  renderPhone() {
    const { refreshing, feeds } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <FlatList
            contentInset={{ top: 22 }}
            contentOffset={{ y: -22 }}
            ListHeaderComponent={this.renderHeader}
            refreshControl={
              <RefreshControl
                tintColor={colors.primary}
                refreshing={refreshing}
                onRefresh={this.onRefresh}
              />
            }
            style={styles.list}
            data={feeds}
            keyExtractor={i => i.feed_id}
            ItemSeparatorComponent={this.renderSeparator}
            renderItem={this.renderItem}
          />
        </View>
      </View>
    );
  }

  render() {
    const { refreshing, feeds } = this.state;
    return isTablet ? this.renderTablet() : this.renderPhone();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    ...(isTablet ? { flexDirection: 'row' } : {}),
  },
  mainContainer: {
    flex: 1,
    ...(isTablet ? { maxWidth: '35%' } : {}),
  },
  sidebarContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: 'transparent',
    borderLeftColor: colors.primary,
  },
  contentContainer: {
    paddingTop: 30,
  },
  headerContainer: {},
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
  unsubscribeContainer: {
    paddingLeft: 10,
    paddingBottom: 10,
    paddingRight: 10,
  },
  unsubscribe: {
    fontFamily: 'Verdana',
    color: colors.links,
    fontSize: 11,
  },
  feedFailure: {
    fontFamily: 'Verdana',
    color: colors.errorBackground,
    fontSize: 11,
  },
});
