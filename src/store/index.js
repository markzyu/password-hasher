export const updatePassword = item => {
  if (window && window.localStorage) {
    window.localStorage.setItem(`passwordv1-${item.name}`, JSON.stringify(item));
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

const KEY_USER_AGREEMENT_READ = "password-metav1-user-agreement-read";

export const setAgreementRead = boolVal => {
  window.localStorage.setItem(KEY_USER_AGREEMENT_READ, JSON.stringify(boolVal));
}

export const getAgreementRead = () => !!JSON.parse(window.localStorage.getItem(KEY_USER_AGREEMENT_READ));
