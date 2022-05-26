import { updatePassword } from "../store"

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

export const loadPasswords = content => ({type: 'LOAD_PASSWORDS', list: content})

export const dismissError = () => ({type: 'DISMISS_ERROR'})
export const showError = (msg) => ({type: 'SHOW_ERROR', msg})

export const showPasswdDetails = possibleMatches => ({type: 'SHOW_PASSWD_DETAILS', possibleMatches})
export const dismissPasswdDetails = () => ({type: 'DISMISS_PASSWD_DETAILS'})

export const loadAgreementStatus = agreed => ({type: 'LOAD_USER_AGREEMENT_STATUS', agreed})

export const setShowSettings = show => ({type: 'SHOW_SETTINGS', show})
