import Feeds from './Feeds';
import { connect } from 'react-redux';
import { updateFeeds, removeFeed } from 'actions/feeds';

const mapStateToProps = state => ({
  feeds: state.feeds.feeds,
  items: state.feeds.feedItems,
});

const mapDispatchToProps = dispatch => ({
  updateFeeds: feeds => {
    dispatch(updateFeeds(feeds));
  },
  removeFeed: feed => {
    dispatch(removeFeed(feed));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Feeds);
