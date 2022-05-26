import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { createStore } from 'redux';

import App from './App';
import rootReducer from '../reducers';
import {updatePassword} from '../store';
import { act } from 'react-dom/test-utils';
import { sleep } from '../lib/utils';

const exampleApp = () => render(
  <Provider store={createStore(rootReducer)}>
    <App />
  </Provider>
);

test('renders password list', done => {
  const { getByTestId, getByText } = exampleApp();
  const loading = getByText("Loading...");
  expect(loading).toBeInTheDocument();
  setTimeout(() => {
    const list = getByTestId("password-list");
    expect(loading).not.toBeInTheDocument();
    expect(list).toBeInTheDocument();
    done();
  }, 2000);
});

test('loads passwords from window.localStorage', done => {
  window.localStorage.clear();
  updatePassword({name: "passwordName123", hash: "abc", salt: "def", hashMethod: "sha512;last4"});
  const { getByText } = exampleApp();
  setTimeout(() => {
    const text = getByText("passwordName123");
    expect(text).toBeInTheDocument();
    done();
  }, 2000);
});

test('Clicking Settings button makes Settings page show up', async () => {
  const { getByText, queryByText } = exampleApp();
  await act(() => sleep(1000));

  const settingsButton = getByText("Settings");
  const exportButton1 = queryByText("Export");
  expect(settingsButton).toBeVisible();
  expect(exportButton1).toBeNull();

  fireEvent.click(settingsButton);

  const exportButton2 = getByText("Export");
  expect(exportButton2).toBeVisible();
})
