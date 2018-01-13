import { _post, _delete } from 'api';

export function SignInRequest({ name, password }) {
  return _post('/api/sessions', {
    name,
    password,
  });
}

export function SignOutRequest(sessionId) {
  return _delete(`/api/sessions/${sessionId}`);
}
