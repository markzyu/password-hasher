import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { UADialogTestable } from './UserAgreementDialog';

const mockDispatch = jest.fn();
const makeExample = () => render(
  <UADialogTestable dispatch={mockDispatch} showAgreement={true}/>
);

test('Sends loadAgreementStatus action when clicking Dialog hide button', () => {
  mockDispatch.mockClear();
  const { getByText } = makeExample();
  const btn = getByText("Dismiss");
  expect(btn).toBeInTheDocument();
  fireEvent.click(btn);

  expect(mockDispatch).toHaveBeenCalledTimes(1);
  let action = mockDispatch.mock.calls[0][0];
  expect(action.type).toBe('LOAD_USER_AGREEMENT_STATUS');
  expect(action.agreed).toBe(true);
});