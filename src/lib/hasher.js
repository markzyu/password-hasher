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

const parseHashMethod = hashMethod => {
  if (!hashMethod.startsWith('sha512;last') || hashMethod.length !== 'sha512;lastN'.length)
    throw new Error(`Unsupported hash method: ${hashMethod}`);

  const N = parseInt(hashMethod['sha512;lastN'.length - 1]);
  return N;
}

export const toHash = (hashMethod, salt, password) => {
  const N = parseHashMethod(hashMethod);
  const hash = _rawSha512(salt.toString() + password.toString());
  return hash.slice(hash.length - N);
}

export const toPartsHash = (hashMethod, salt, password, parts=3) => {
  if (parts <= 1) {
    throw new Error(`Unsupported number of hash parts: ${parts}, should be > 1`);
  }

  const partLen = Math.floor(password.length / parts);
  const ans = Array(parts - 1).fill(0).map((_, i) => {
    const part = password.slice(i * partLen, (i + 1) * partLen);
    return toHash(hashMethod, salt, part);
  });

  const finalPart = password.slice((parts - 1) * partLen);
  ans.push(toHash(hashMethod, salt, finalPart));
  return ans;
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
