import { _get, _post, _delete } from 'api';

export function UnreadItemsRequest() {
  return _get('/api/items/unread');
}

export function MarkItemReadRequest(itemID) {
  return _delete(`/api/items/unread/${itemID}`);
}

export function MarkAllReadRequest({ itemIDs }) {
  return _post(`/api/items/unread/mark_multiple_read`, { itemIDs });
}
