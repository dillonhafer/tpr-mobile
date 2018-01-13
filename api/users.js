import { _post } from 'api';

export function RequestPasswordResetRequest({ email }) {
  return _post('/api/request_password_reset', {
    email,
  });
}
