const SESSION_KEY = '_tpr_session';
const DOMAIN_KEY = '_tpr_domain';
const USER_KEY = '_tpr_user';

import { SecureStore } from 'expo';

export function SetAuthenticationToken(token) {
  try {
    return SecureStore.setItemAsync(SESSION_KEY, token);
  } catch (err) {
    return null;
  }
}

export function SetDomain(domain) {
  try {
    return SecureStore.setItemAsync(DOMAIN_KEY, domain);
  } catch (err) {
    return null;
  }
}

export function GetDomain() {
  try {
    return SecureStore.getItemAsync(DOMAIN_KEY);
  } catch (err) {
    return '';
  }
}

export function GetAuthenticationToken() {
  try {
    return SecureStore.getItemAsync(SESSION_KEY);
  } catch (err) {
    return null;
  }
}

export function SetCurrentUser(user) {
  try {
    return SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  } catch (err) {
    return null;
  }
}
export async function GetCurrentUser() {
  try {
    const userStorage = await SecureStore.getItemAsync(USER_KEY);
    if (
      userStorage === null ||
      userStorage === undefined ||
      userStorage === 'undefined'
    ) {
      await RemoveAuthentication();
      return null;
    } else {
      return JSON.parse(userStorage);
    }
  } catch (err) {
    return null;
  }
}

export async function RemoveAuthentication() {
  try {
    SecureStore.deleteItemAsync(SESSION_KEY);
    SecureStore.deleteItemAsync(USER_KEY);
    return;
  } catch (err) {
    return null;
  }
}

export async function IsAuthenticated() {
  const user = await SecureStore.getItemAsync(USER_KEY);
  if (user === null || user === undefined) {
    return false;
  } else {
    return true;
  }
}

export async function GetExportURL() {
  const _baseURL = await GetDomain();
  const baseURL = `https://${_baseURL}`;
  const sessionToken = await GetAuthenticationToken();
  return `${baseURL}/api/feeds.xml?session=${sessionToken}`;
}
