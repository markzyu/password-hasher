import {genGuessesFromHash, toHash, _rawSha512} from './hasher.js';

const salt = '2644047a-eca9-4858-8282-048480983051'; 

test('empty text converts to correct sha512', () => {
  expect(_rawSha512('')).toEqual('cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e');
});

test('example hash', () => {
  expect(_rawSha512('2644047a-eca9-4858-8282-048480983051abc000')).toEqual('fa03e1096c21c7b497513dcf8445abf0af7b77368a67a95ec6b2e4b2d3b9333cc252757e31b638564779d32819ab49e61efaed4ab95cb82de15261709300a02d');
  expect(toHash('sha512;last4', salt, 'abc000')).toEqual('a02d');
});

test('provide example guess words from hash', () => {
  expect(toHash('sha512;last4', salt, 'apples')).toEqual('fd7c');
  expect(genGuessesFromHash('sha512;last4', salt, 'fd7c')).toContain('apples');
});
