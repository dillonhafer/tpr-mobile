import { _get, _post, _delete } from 'api';

export function AllFeedsRequest() {
  return _get('/api/feeds');
}

export function UnsubscribeFeedRequest(feedID) {
  return _delete(`/api/subscriptions/${feedID}`);
}

export function SubscribeFeedRequest({ url }) {
  return _post('/api/subscriptions', { url });
}

export function ImportFeedRequest(formData) {
  return _post('/api/feeds/import', formData, {
    'Content-Type': 'multipart/form-data',
  });
}
