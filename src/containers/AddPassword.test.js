import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { AddPasswordTestable } from './AddPassword';

beforeEach(() => {
  window.localStorage.clear();
})

test('Sends addPassword action when "Add" button is clicked', () => {
  const mockDispatch = jest.fn();
  const { getByText } = render(<AddPasswordTestable dispatch={mockDispatch}/>);
  const btn = getByText("Add");
  expect(btn).toBeInTheDocument();
  fireEvent.click(btn);

  expect(mockDispatch).toHaveBeenCalledTimes(1);
  let action = mockDispatch.mock.calls[0][0];
  expect(action.type).toBe('ADD_PASSWORD');
  expect(action.name).toBe('');
  expect(action.partsHash).toBeUndefined();
  expect(action.partsHashMethod).toBeUndefined();
});

test('Clears input boxes when "Add" button is clicked', async () => {
  const mockDispatch = jest.fn();
  const { getByText, getByLabelText } = render(<AddPasswordTestable dispatch={mockDispatch}/>);

  const name = getByLabelText('Name');
  const password = getByLabelText('Password');
  fireEvent.change(name, {target: {value: 'test1'}});
  fireEvent.change(password, {target: {value: 'test2'}});
  expect(name.value).toBe('test1');
  expect(password.value).toBe('test2');

  const btn = getByText('Add');
  expect(btn).toBeInTheDocument();
  fireEvent.click(btn);

  expect(mockDispatch).toHaveBeenCalledTimes(1);
  let action = mockDispatch.mock.calls[0][0];
  expect(action.type).toBe('ADD_PASSWORD');
  expect(action.name).toBe('test1');

  expect(name.value).toBe('');
  expect(password.value).toBe('');
});

test('Updates window.localStorage when "Add" button is clicked', () => {
  const mockDispatch = jest.fn();
  const { getByText } = render(<AddPasswordTestable dispatch={mockDispatch}/>);
  const btn = getByText("Add");
  expect(btn).toBeInTheDocument();
  fireEvent.click(btn);
  expect(window.localStorage.length).toBe(1);
  expect(window.localStorage.key(0)).toBe('passwordv1-');
  expect(JSON.parse(window.localStorage.getItem('passwordv1-')).name).toBe('');
});

test('Sends showError action when password names have duplicates', () => {
  const mockDispatch = jest.fn();
  const { getByText } = render(
    <AddPasswordTestable dispatch={mockDispatch} allPasswords={[{name: ''}]}/>
  );
  const btn = getByText("Add");
  expect(btn).toBeInTheDocument();
  fireEvent.click(btn);
  fireEvent.click(btn);

  expect(mockDispatch).toHaveBeenCalledTimes(2);
  let action = mockDispatch.mock.calls[1][0];
  expect(action.type).toBe('SHOW_ERROR');
  expect(action.msg).toBe(
    'There is already a password named "". Please use a different name.'
  );
});

test('Saves hints about password parts when asked to', () => {
  const mockDispatch = jest.fn();
  const { getByText } = render(<AddPasswordTestable dispatch={mockDispatch} storeHints={true}/>);
  const btn = getByText("Add");
  expect(btn).toBeInTheDocument();
  fireEvent.click(btn);

  expect(mockDispatch).toHaveBeenCalledTimes(1);
  let action = mockDispatch.mock.calls[0][0];
  console.log(action);
  expect(action.type).toBe('ADD_PASSWORD');
  expect(action.name).toBe('');
  expect(action.partsHash).toHaveLength(3);
  expect(action.partsHashMethod).toBe("sha512;last1");
})