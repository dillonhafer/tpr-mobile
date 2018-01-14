import { _get, _delete } from 'api';

export function AllFeedsRequest() {
  return _get('/api/feeds');
}

export function UnsubscribeFeedRequest(feedID) {
  return _delete(`/api/subscriptions/${feedID}`);
}
