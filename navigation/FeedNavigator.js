import { createStackNavigator as StackNavigator } from 'react-navigation';

import FeedsScreen from 'screens/FeedsScreen';
import FeedScreen from 'screens/Feed';

const FeedNavigator = StackNavigator(
  {
    Feeds: {
      screen: FeedsScreen,
      navigationOptions: {
        header: null,
      },
    },
    FeedScreen: {
      screen: FeedScreen,
    },
  },
  {
    navigationOptions: {
      gesturesEnabled: true,
    },
  },
);

export default FeedNavigator;
