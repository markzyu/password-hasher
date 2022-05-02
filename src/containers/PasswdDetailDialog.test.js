import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { PasswdDetailDialogTestable } from './PasswdDetailDialog';

const mockDispatch = jest.fn();
const makeExample = () => render(
  <PasswdDetailDialogTestable possibleMatches={["english", "test-word"]} dispatch={mockDispatch} show={true}/>
);

test('Sends dismissPasswdDetails action when clicking Dialog hide button', () => {
  mockDispatch.mockClear();
  const { getByText } = makeExample();
  const btn = getByText("Dismiss");
  expect(btn).toBeInTheDocument();
  fireEvent.click(btn);

  expect(mockDispatch).toHaveBeenCalledTimes(1);
  let action = mockDispatch.mock.calls[0][0];
  expect(action.type).toBe('DISMISS_PASSWD_DETAILS');
});

test('Shows possibleMatches', () => {
  const { getByText } = makeExample();
  const txt = getByText(/test-word/);
  expect(txt).toBeInTheDocument();
});
