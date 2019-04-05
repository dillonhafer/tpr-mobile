import Home from './Home';
import { connect } from 'react-redux';
import { updateItems, removeItems, removeItem } from 'actions/feeds';

const mapStateToProps = state => ({
  items: state.feeds.feedItems,
  lastRefreshDate: state.feeds.lastRefreshDate,
});

const mapDispatchToProps = dispatch => ({
  updateItems: items => {
    dispatch(updateItems(items));
  },
  removeItem: item => {
    dispatch(removeItem(item));
  },
  removeItems: itemIDs => {
    dispatch(removeItems(itemIDs));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
