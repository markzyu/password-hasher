import { getSettings, setSettings, updatePassword } from "../store"
import { SETTINGS_STORE_HINTS } from "../lib/utils"

export const addPassword = (name, salt, hash, hashMethod) => ({
  type: 'ADD_PASSWORD',
  name,
  salt,
  hash,
  hashMethod,
})

export const rmPassword = (name) => ({
  type: 'RM_PASSWORD',
  name,
})

export const tryAddPassword = (dispatch, name, salt, hash, hashMethod) => {
  try {
    updatePassword({name: name, salt: salt, hash: hash, hashMethod: hashMethod})
  } catch (err) {
    dispatch(showError(err.message))
    return false;
  }
  dispatch(addPassword(name, salt, hash, hashMethod));
  return true;
}

export const loadAndCacheSettings = dispatch => {
  const val = getSettings(SETTINGS_STORE_HINTS);
  if (typeof val === 'boolean') {
    dispatch(updateCachedSettings(SETTINGS_STORE_HINTS, val));
  } else {
    dispatch(updateCachedSettings(SETTINGS_STORE_HINTS, false));
  }
};

export const changeSettings = (dispatch, key, val) => {
  setSettings(key, val);
  dispatch(updateCachedSettings(key, val));
}

export const loadPasswords = content => ({type: 'LOAD_PASSWORDS', list: content})

export const dismissError = () => ({type: 'DISMISS_ERROR'})
export const showError = (msg) => ({type: 'SHOW_ERROR', msg})

export const showPasswdDetails = possibleMatches => ({type: 'SHOW_PASSWD_DETAILS', possibleMatches})
export const dismissPasswdDetails = () => ({type: 'DISMISS_PASSWD_DETAILS'})

export const loadAgreementStatus = agreed => ({type: 'LOAD_USER_AGREEMENT_STATUS', agreed})

export const setShowSettings = show => ({type: 'SHOW_SETTINGS', show})
export const updateCachedSettings = (key, val) => ({type: 'UPDATE_CACHED_SETTINGS', key, val})
