import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { createStore } from 'redux';
import rootReducer from '../reducers';

import PasswordList from './PasswordList';
import { getColorStyle } from './PasswordList';

const mockOnMore = jest.fn();
const exampleContent = [
  {name: 'test123', salt: '8826aa59-4133-4074-a904-c9be256be784', hash: '3c1c', hashMethod: 'sha512;last4', onMore: mockOnMore},
  {name: 'abc000' , salt: '2644047a-eca9-4858-8282-048480983051', hash: 'a02d', hashMethod: 'sha512;last4', onMore: mockOnMore},
]
const examplePasswordList = () => render(
  <Provider store={createStore(rootReducer)}>
    <PasswordList content={exampleContent} />
  </Provider>
);

test('renders password names of all contents', () => {
  const { getByText } = examplePasswordList();
  expect(getByText("test123")).toBeInTheDocument();
  expect(getByText("abc000")).toBeInTheDocument();
});

test('getColorStyle returns light color, dark text, with box-shadow', () => {
  const styles = getColorStyle('9d4f');
  expect(styles.color).toBe("black");
  expect(styles.backgroundColor).toBe("#87c33ca0");
  expect(styles.boxShadow).toBe("0.3em 0.1em #87c33c50");
});

test('getColorStyle returns dark color, light text, with box-shadow', () => {
  const styles = getColorStyle('9b60');
  expect(styles.color).toBe("white");
  expect(styles.backgroundColor).toBe("#000000a0");
  expect(styles.boxShadow).toBe("0.3em 0.1em #00000050");
});
