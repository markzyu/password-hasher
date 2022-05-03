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

test('Clicking "Import" button actually imports passwords', async () => {
  const mockText = jest.fn().mockResolvedValue('[{"name":"a","salt":"ff3ed16e-cc3f-4d49-ac52-c1540a7d7a01","hash":"f4","hashMethod":"sha512;last2"}]');
  const mockGetFile = jest.fn().mockResolvedValue({text: mockText});
  const mockOpenFile = jest.fn().mockResolvedValue([{getFile: mockGetFile}]);
  const mockDispatch = jest.fn();

  window.showOpenFilePicker = mockOpenFile;
  window.localStorage.clear();

  const { getByText } = render(<AddPasswordTestable dispatch={mockDispatch} allPasswords={[]}/>);
  const importBtn = getByText("Import");

  expect(importBtn).toBeInTheDocument();
  expect(importBtn).toBeEnabled();
  fireEvent.click(importBtn);

  await act(() => new Promise(done => setTimeout(done, 500)));

  let action = mockDispatch.mock.calls[0][0];
  expect(action.type).toBe('ADD_PASSWORD');
  expect(action.name).toBe('a');
  expect(action.salt).toBe('ff3ed16e-cc3f-4d49-ac52-c1540a7d7a01');
  expect(action.hashMethod).toBe('sha512;last2');
  expect(action.hash).toBe('f4');

  expect(window.localStorage.length).toBe(1);
  expect(window.localStorage.key(0)).toBe('passwordv1-a');
});