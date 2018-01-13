import { StatusBar, Platform } from 'react-native';
import {
  GetAuthenticationToken,
  RemoveAuthentication,
  GetDomain,
} from 'utils/authentication';
import { error } from 'notify';
import { Constants, Util } from 'expo';

const base = async (path, method, headers = {}, body = {}) => {
  try {
    const _baseURL = await GetDomain();
    const baseURL = `https://${_baseURL}`;
    let sessionToken = await GetAuthenticationToken();
    sessionToken = sessionToken || '';

    let req = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Authentication': sessionToken,
        ...headers,
      },
      method,
    };

    if (method !== 'GET') {
      switch (req.headers['Content-Type']) {
        case 'application/json':
          req.body = JSON.stringify(body);
          break;
        case 'multipart/form-data':
          delete req.headers['Content-Type'];
          req.body = body;
          break;
        default:
          req.body = body;
      }
    }

    if (Platform.OS === 'ios') {
      StatusBar.setNetworkActivityIndicatorVisible(true);
    }
    const resp = await fetch(baseURL + path, req);

    // Logouts don't work semantically
    if (path.startsWith('/api/sessions') && method === 'DELETE') {
      return {
        ok: true,
      };
    }

    switch (resp.status) {
      case 503:
        error('We are performing maintenance. We should be done shortly.');
        return;
      case 500:
      case 404:
        error('Something went wrong');
        return;
      case 403:
      case 401:
        error('Permission Denied. This incident will be reported');
        await RemoveAuthentication();
        Util.reload();
        return;
      default:
    }

    if (!resp.ok) {
      const contentType = resp.headers.get('Content-Type');
      const text = await resp.text();
      const err = {
        error: /json/i.test(contentType) ? JSON.parse(text).error : text.trim(),
        status: resp.status,
        ok: false,
      };
      throw err;
    }

    const json = (await resp.json()) || {};
    return { ...json, ok: true };
  } catch (err) {
    error(err.error || 'Something went wrong');
  } finally {
    if (Platform.OS === 'ios') {
      StatusBar.setNetworkActivityIndicatorVisible(false);
    }
  }
};

export const _get = (path, headers = {}) => {
  return base(path, 'GET', headers);
};
export const _post = (path, body = {}, headers = {}) => {
  return base(path, 'POST', headers, body);
};
export const _put = (path, body = {}, headers = {}) => {
  return base(path, 'PUT', headers, body);
};
export const _patch = (path, body = {}, headers = {}) => {
  return base(path, 'PATCH', headers, body);
};
export const _delete = (path, body = {}, headers = {}) => {
  return base(path, 'DELETE', headers, body);
};

export const _raw_get = (path, body = {}, headers = {}) => {
  return fetch(baseURL + path, {
    method: 'GET',
    headers,
    body,
  });
};
