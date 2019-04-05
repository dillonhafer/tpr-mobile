import {
  UPDATE_FEEDS,
  UPDATE_ITEMS,
  REMOVE_FEED,
  REMOVE_ITEM,
  REMOVE_ITEMS,
  UPDATE_ARCHIVE_ITEMS,
} from 'redux-constants/action-types';

export const updateItems = items => {
  return {
    type: UPDATE_ITEMS,
    items,
  };
};

export const updateFeeds = feeds => {
  return {
    type: UPDATE_FEEDS,
    feeds,
  };
};

export const updateArchiveItems = archiveItems => {
  return {
    type: UPDATE_ARCHIVE_ITEMS,
    archiveItems,
  };
};

export const removeFeed = feed => {
  return {
    type: REMOVE_FEED,
    feed,
  };
};

export const removeItem = item => {
  return {
    type: REMOVE_ITEM,
    item,
  };
};

export const removeItems = itemIDs => {
  return {
    type: REMOVE_ITEMS,
    itemIDs,
  };
};
