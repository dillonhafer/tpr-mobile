import {
  UPDATE_FEEDS,
  UPDATE_ITEMS,
  REMOVE_FEED,
  REMOVE_ITEM,
  REMOVE_ITEMS,
  UPDATE_ARCHIVE_ITEMS,
} from 'redux-constants/action-types';

import moment from 'moment';

const initialState = {
  feeds: [],
  feedItems: [],
  archiveItems: [],
  lastRefreshDate: moment(),
};

export default function feedState(state = initialState, action) {
  switch (action.type) {
    case UPDATE_FEEDS:
      return {
        ...state,
        feeds: action.feeds,
      };
    case UPDATE_ITEMS:
      return {
        ...state,
        lastRefreshDate: moment(),
        feedItems: action.items,
      };
    case UPDATE_ARCHIVE_ITEMS:
      return {
        ...state,
        archiveItems: action.archiveItems,
      };
    case REMOVE_FEED:
      return {
        ...state,
        feeds: state.feeds.filter(i => i.feed_id !== action.feed.feed_id),
      };
    case REMOVE_ITEMS:
      return {
        ...state,
        feedItems: state.feedItems.filter(i => !action.itemIDs.includes(i.id)),
      };
    case REMOVE_ITEM:
      return {
        ...state,
        feedItems: state.feedItems.filter(i => i.id !== action.item.id),
      };
    default:
      return state;
  }
}
