import { _get, _patch, _post } from 'api';

export function RequestPasswordResetRequest({ email }) {
  return _post('/api/request_password_reset', {
    email,
  });
}

export function RegisterRequest(params) {
  return _post('/api/register', params);
}

export function GetAccountRequest() {
  return _get('/api/account');
}

export function UpdateAccountRequest({ email, existingPassword, newPassword }) {
  return _patch('/api/account', { email, existingPassword, newPassword });
}
