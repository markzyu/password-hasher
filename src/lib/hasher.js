import SHA512 from 'crypto-js/sha512';
import englishWords from 'an-array-of-english-words';

export const _rawSha512 = str => {
  return SHA512(str).toString();
  /*
  const hasher = createHash('sha512');
  hasher.update(str.toString());
  return hasher.digest('hex').toString();
  */
};

export const toHash = (hashMethod, salt, password) => {
  if (!hashMethod.startsWith('sha512;last') || hashMethod.length !== 'sha512;lastN'.length)
    throw new Error(`Unsupported hash method: ${hashMethod}`);

  const N = parseInt(hashMethod['sha512;lastN'.length - 1]);
  const hash = _rawSha512(salt.toString() + password.toString());
  return hash.slice(hash.length - N);
}

export const genGuessesFromHash = (hashMethod, salt, hash, random=false, first=20) => {
  var count = 0
  var words = englishWords
  if (random) words = words.sort(() => Math.random() - 0.5)
  return words.filter(x => {
    if (count >= first) return false;
    if (toHash(hashMethod, salt, x) !== hash) return false;
    count ++;
    return true;
  }).sort();
}
