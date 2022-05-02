import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { AddPasswordTestable } from './AddPassword';
import { act, mockComponent } from 'react-dom/test-utils';

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
});

test('Updates window.localStorage when "Add" button is clicked', () => {
  window.localStorage.clear();
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

  expect(mockDispatch).toHaveBeenCalledTimes(1);
  let action = mockDispatch.mock.calls[0][0];
  expect(action.type).toBe('SHOW_ERROR');
  expect(action.msg).toBe(
    'There is already a password named "". Please use a different name.'
  );
});

test('Clicking "Export" button makes it grey out, and turn into "Download" button', async () => {
  const mockcreateObjURL = jest.fn(blob => {
    const expectBlob = new Blob(['[{"name": "test123"}]'], {type: 'application/json'});
    expect(blob).toEqual(expectBlob);
    return "blob:http://mock_url";
  });
  const mockDispatch = jest.fn();
  global.URL.createObjectURL = mockcreateObjURL;

  const { getByText } = render(<AddPasswordTestable dispatch={mockDispatch} allPasswords={[{name: 'test123'}]}/>);

  const exportBtn = getByText("Export");
  expect(exportBtn).toBeInTheDocument();
  expect(exportBtn).toBeEnabled();
  fireEvent.click(exportBtn);
  expect(exportBtn).not.toBeEnabled();

  await act(() => new Promise(done2 => setTimeout(done2, 1500)));
  expect(exportBtn).not.toBeInTheDocument();

  const downloadBtn = getByText("Download");
  expect(downloadBtn).toBeInTheDocument();
  expect(downloadBtn).toBeEnabled();
  expect(downloadBtn.href).toEqual("blob:http://mock_url");
  expect(mockcreateObjURL).toHaveBeenCalledTimes(1);
  fireEvent.click(downloadBtn);

  expect(downloadBtn).not.toBeInTheDocument();
  const exportBtn2 = getByText("Export");
  expect(exportBtn2).toBeInTheDocument();
  expect(exportBtn2).toBeEnabled();
})
