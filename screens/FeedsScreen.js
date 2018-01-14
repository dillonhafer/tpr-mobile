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
} from 'react-native';

import {
  AllFeedsRequest,
  SubscribeFeedRequest,
  UnsubscribeFeedRequest,
} from 'api/feeds';
import { WebBrowser } from 'expo';
import colors from 'constants/colors';
import { notice } from 'notify';
import { GetExportURL } from 'utils/authentication';
import PrimaryButton from 'components/forms/PrimaryButton';
import { FileSystem } from 'expo';
import { values } from 'lodash';
import moment from 'moment';
import Form from 'components/forms/Form';
import TextInputContainer from 'components/forms/TextInputContainer';

export default class SettingsScreen extends React.Component {
  state = {
    refreshing: false,
    feeds: [],
    url: '',
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

  exportXML = async () => {
    const exportURL = await GetExportURL();
    await FileSystem.downloadAsync(
      exportURL,
      FileSystem.documentDirectory + 'tpr-opml.xml',
    );
    notice('Download Complete');
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
          <TouchableOpacity onPress={_ => this.handleUnsubscribe(feed.feed_id)}>
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
      </View>
    );
  };

  render() {
    const { refreshing, feeds } = this.state;
    return (
      <View style={styles.container}>
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
