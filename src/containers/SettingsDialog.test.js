import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { SettingsDialogTestable } from './SettingsDialog';

test('Clicking "Export" button makes it grey out, and turn into "Download" button', async () => {
  const mockcreateObjURL = jest.fn(blob => {
    const expectBlob = new Blob(['[{"name": "test123"}]'], {type: 'application/json'});
    expect(blob).toEqual(expectBlob);
    return "blob:http://mock_url";
  });
  const mockDispatch = jest.fn();
  global.URL.createObjectURL = mockcreateObjURL;

  const { getByText } = render(<SettingsDialogTestable dispatch={mockDispatch} allPasswords={[{name: 'test123'}]} showSettings={true} />);

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

  const { getByText } = render(<SettingsDialogTestable dispatch={mockDispatch} allPasswords={[]} showSettings={true} />);
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