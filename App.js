import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, ScreenOrientation } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import RootNavigation from './navigation/RootNavigation';
import Device from 'utils/Device';
import { GetDomain, GetCurrentUser } from 'utils/authentication';
import { values, orderBy } from 'lodash';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { UnreadItemsRequest } from 'api/items';
import { AllFeedsRequest } from 'api/feeds';
import { updateItems, updateFeeds } from 'actions/feeds';

// Allow iPads to use landscape
if (Platform.OS === 'ios' && !Device.isTablet()) {
  ScreenOrientation.lockAsync(
    ScreenOrientation.OrientationLock.PORTRAIT_UP,
  ).catch(() => {});
}

// Redux
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from 'reducers';

const store = createStore(reducers);

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
          {Platform.OS === 'android' && (
            <View style={styles.statusBarUnderlay} />
          )}
          <ActionSheetProvider>
            <Provider key="app" store={store}>
              <RootNavigation />
            </Provider>
          </ActionSheetProvider>
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    const domain = await GetDomain();
    if (domain) {
      store.dispatch({ type: 'UPDATE_DOMAIN', domain });
    }

    const user = await GetCurrentUser();
    if (user) {
      store.dispatch({
        type: 'UPDATE_CURRENT_USER',
        user,
      });
    }

    const resp = await UnreadItemsRequest();
    if (resp && resp.ok) {
      const items = orderBy(
        values(resp).slice(0, -1),
        ['publication_time'],
        ['desc'],
      );
      store.dispatch(updateItems(items));
    }

    const feedResp = await AllFeedsRequest();
    if (feedResp && feedResp.ok) {
      const feeds = values(feedResp).slice(0, -1);
      store.dispatch(updateFeeds(feeds));
    }

    return Promise.all([
      Font.loadAsync({
        ...Ionicons.font,
        Verdana: require('./assets/fonts/Verdana.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7ab0b2',
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});
