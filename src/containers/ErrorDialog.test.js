import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { ErrorDialogTestable } from './ErrorDialog';

const mockDispatch = jest.fn();
const makeExample = () => render(
  <ErrorDialogTestable errorMsg="foobar" dispatch={mockDispatch} showError={true}/>
);

test('Sends dismissError action when clicking Dialog hide button', () => {
  mockDispatch.mockClear();
  const { getByText } = makeExample();
  const btn = getByText("Dismiss");
  expect(btn).toBeInTheDocument();
  fireEvent.click(btn);

  expect(mockDispatch).toHaveBeenCalledTimes(1);
  let action = mockDispatch.mock.calls[0][0];
  expect(action.type).toBe('DISMISS_ERROR');
});

test('Shows the error message', () => {
  mockDispatch.mockClear();
  const { getByText } = makeExample();
  const txt = getByText("foobar");
  expect(txt).toBeInTheDocument();
});
