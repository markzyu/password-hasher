export const updatePassword = item => {
  if (window && window.localStorage) {

    const key = `passwordv1-${item.name}`;
    if (window.localStorage.getItem(key) !== null) {
      throw new Error(
        `There is already a password named "${item.name}". Please use a different name.`
      );
    }

    window.localStorage.setItem(key, JSON.stringify(item));
  }
};

export const getPasswords = () => {
  let storage = window && window.localStorage;
  if (!storage) return;

  let ans = [];
  for (let i = 0; i < storage.length; i ++) {
    let key = storage.key(i);
    if (key.indexOf("passwordv1-") !== 0) continue;

    let item = storage.getItem(key);
    ans.push(JSON.parse(item));
  }
  return ans
}

export const clearPassword = name => {
  if (window && window.localStorage) {
    window.localStorage.removeItem(`passwordv1-${name}`);
  }
}

export const getSettings = name => {
  let storage = window && window.localStorage;
  if (!storage) return null;

  const key = `password-settingsv1-${name}`;
  return JSON.parse(window.localStorage.getItem(key));
}

export const setSettings = (name, val) => {
  let storage = window && window.localStorage;
  if (!storage) return;

  const key = `password-settingsv1-${name}`;
  return window.localStorage.setItem(key, JSON.stringify(val));
}

const KEY_USER_AGREEMENT_READ = "password-metav1-user-agreement-read";

export const setAgreementRead = boolVal => {
  window.localStorage.setItem(KEY_USER_AGREEMENT_READ, JSON.stringify(boolVal));
}

export const getAgreementRead = () => !!JSON.parse(window.localStorage.getItem(KEY_USER_AGREEMENT_READ));
