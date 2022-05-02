import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { createStore } from 'redux';

import VerifyPassword from './VerifyPassword';

const mockOnDelete = jest.fn();
const mockOnMore = jest.fn();
const exampleRender = () => render(
  <Provider store={createStore(x => x)}>
    <VerifyPassword 
      onDelete={mockOnDelete}
      onMore={mockOnMore}
      name="blah888-password-is-abc000" 
      salt="2644047a-eca9-4858-8282-048480983051" 
      hash="a02d" 
      hashMethod="sha512;last4"/>
  </Provider>
);

test('renders name', () => {
  const { getByText } = exampleRender();
  const txt = getByText(/blah888-password-is-abc000/);
  expect(txt).toBeInTheDocument();
});

test('primary button is called "Check" and changes when pressed', () => {
  const { getByText } = exampleRender();
  const btn = getByText("Check");
  expect(btn).toBeInTheDocument();

  fireEvent.click(btn);
  expect(btn.textContent).toEqual("More..");
});

test('primary button is called "Check" and changes when hitting Enter', () => {
  const { getByText, getByTestId } = exampleRender();
  const btn = getByText("Check");
  const inputBar = getByTestId("verify-password:input");
  expect(btn).toBeInTheDocument();
  expect(inputBar).toBeInTheDocument();
  
  fireEvent.keyPress(inputBar, {key: 'Enter', code: 'Enter', charCode: 123});
  expect(btn.textContent).toEqual("More..");
});

test('primary button changes back to "Check" when text changes', () => {
  const { getByText, getByTestId } = exampleRender();
  const btn = getByText("Check");
  const inputBar = getByTestId("verify-password:input");
  expect(btn).toBeInTheDocument();
  expect(inputBar).toBeInTheDocument();

  fireEvent.click(btn);
  expect(btn.textContent).toEqual("More..");
  fireEvent.keyPress(inputBar, {key: 'A', code: 'KeyA', charCode: 123});
  fireEvent.change(inputBar, {target: {value: 'A'}});
  expect(btn.textContent).toEqual("Check");
});

test('complains if password is wrong and "Check" is clicked', () => {
  const { getByText, getByTestId } = exampleRender();
  const btn = getByText("Check");
  const inputBar = getByTestId("verify-password:input");
  expect(btn).toBeInTheDocument();
  expect(inputBar).toBeInTheDocument();
  expect(inputBar.classList).not.toContain("is-invalid");
  expect(inputBar.classList).not.toContain("is-valid");

  fireEvent.keyPress(inputBar, {key: 'A', code: 'KeyA', charCode: 123});
  fireEvent.change(inputBar, {target: {value: 'A'}});
  expect(btn.textContent).toEqual("Check");
  fireEvent.click(btn);
  expect(inputBar.classList).toContain("is-invalid");
  expect(inputBar.classList).not.toContain("is-valid");
});

test('complains if password is wrong and user hit Enter', () => {
  const { getByText, getByTestId } = exampleRender();
  const btn = getByText("Check");
  const inputBar = getByTestId("verify-password:input");
  expect(btn).toBeInTheDocument();
  expect(inputBar).toBeInTheDocument();
  expect(inputBar.classList).not.toContain("is-invalid");
  expect(inputBar.classList).not.toContain("is-valid");

  fireEvent.keyPress(inputBar, {key: 'A', code: 'KeyA', charCode: 123});
  fireEvent.change(inputBar, {target: {value: 'A'}});
  fireEvent.keyPress(inputBar, {key: 'Enter', code: 'Enter', charCode: 123});
  expect(inputBar.classList).toContain("is-invalid");
  expect(inputBar.classList).not.toContain("is-valid");
});

test('no complaint if password is correct and user hit Enter', () => {
  const { getByText, getByTestId } = exampleRender();
  const btn = getByText("Check");
  const inputBar = getByTestId("verify-password:input");
  expect(btn).toBeInTheDocument();
  expect(inputBar).toBeInTheDocument();
  expect(inputBar.classList).not.toContain("is-invalid");
  expect(inputBar.classList).not.toContain("is-valid");

  fireEvent.keyPress(inputBar, {key: 'A', code: 'KeyA', charCode: 123});
  fireEvent.change(inputBar, {target: {value: 'A'}});
  fireEvent.keyPress(inputBar, {key: 'Enter', code: 'Enter', charCode: 123});
  expect(inputBar.classList).toContain("is-invalid");
  expect(inputBar.classList).not.toContain("is-valid");

  fireEvent.change(inputBar, {target: {value: 'abc000'}});
  fireEvent.keyPress(inputBar, {key: 'Enter', code: 'Enter', charCode: 123});
  expect(inputBar.classList).not.toContain("is-invalid");
  expect(inputBar.classList).toContain("is-valid");
});

test('Provides "Delete" button for the password', () => {
  mockOnDelete.mockClear();
  const { getByText, getByTestId } = exampleRender();
  const btn = getByText("Delete");
  expect(btn).toBeInTheDocument();
});
