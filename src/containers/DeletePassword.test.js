import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { DeletePasswordTestable } from './DeletePassword';
import { updatePassword } from '../store';

test('Sends rmPassword action when "Delete" button is clicked', () => {
  const mockDispatch = jest.fn();
  const { getByText } = render(<DeletePasswordTestable name="foooBar" dispatch={mockDispatch}/>);
  const btn = getByText("Delete");
  expect(btn).toBeInTheDocument();
  fireEvent.click(btn);

  expect(mockDispatch).toHaveBeenCalledTimes(1);
  let action = mockDispatch.mock.calls[0][0];
  expect(action.type).toBe('RM_PASSWORD');
  expect(action.name).toBe('foooBar');
});

test('Updates window.localStorage when "Delete" button is clicked', () => {
  window.localStorage.clear();
  updatePassword({name: "foooBar"});
  updatePassword({name: "foooBar2"});
  expect(window.localStorage.length).toBe(2);

  const mockDispatch = jest.fn();
  const { getByText } = render(<DeletePasswordTestable name="foooBar" dispatch={mockDispatch}/>);
  const btn = getByText("Delete");
  expect(btn).toBeInTheDocument();
  fireEvent.click(btn);

  expect(mockDispatch).toHaveBeenCalledTimes(1);
  let action = mockDispatch.mock.calls[0][0];
  expect(action.type).toBe('RM_PASSWORD');
  expect(action.name).toBe('foooBar');
  expect(window.localStorage.length).toBe(1);
  expect(window.localStorage.key(0)).toBe('passwordv1-foooBar2');
});
