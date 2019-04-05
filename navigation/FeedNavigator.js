import { createStackNavigator as StackNavigator } from 'react-navigation';

import colors from 'constants/colors';
import FeedsScreen from 'screens/Feeds';
import FeedScreen from 'screens/Feed';

const FeedNavigator = StackNavigator(
  {
    Feeds: {
      screen: FeedsScreen,
    },
    FeedScreen: {
      screen: FeedScreen,
    },
  },
  {
    defaultNavigationOptions: {
      gesturesEnabled: true,
      headerStyle: {
        backgroundColor: colors.primary,
      },
      headerTintColor: '#fff',
    },
  },
);

export default FeedNavigator;
