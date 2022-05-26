import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';

import DismissDialog from '../components/DismissDialog';
import { changeSettings, setShowSettings, tryAddPassword, updateCachedSettings } from '../actions';
import { sleep, SETTINGS_STORE_HINTS } from '../lib/utils';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import { getSettings } from '../store';

const SettingsDialog = props => {
  const [preppingExport, setPreppingExport] = useState(false);
  const [exportUrl, setExportUrl] = useState(null);

  const defaultDispatch = useDispatch();
  const dispatch = props.dispatch || defaultDispatch;

  useEffect(() => {
    const val = getSettings(SETTINGS_STORE_HINTS);
    if (typeof val === 'boolean') {
      dispatch(updateCachedSettings(SETTINGS_STORE_HINTS, val));
    } else {
      dispatch(updateCachedSettings(SETTINGS_STORE_HINTS, false));
    }
  }, [dispatch]);

  const onExport = async () => {
    setPreppingExport(true);
    await sleep(1000);
    const str = JSON.stringify(props.allPasswords);
    const blob = new Blob([str], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    setExportUrl(url);
  }
  const onImport = async () => {
    const [fileHandle] = await window.showOpenFilePicker();
    const file = await fileHandle.getFile();
    const text = await file.text();
    const items = JSON.parse(text);
    const existingNames = new Set();
    for (const item of props.allPasswords) {
      existingNames.add(item.name);
    }
    for (const item of items) {
      const name = item.name;
      const salt = item.salt;
      const hash = item.hash;
      const hashMethod = item.hashMethod;

      if (typeof name != 'string') continue;

      console.log(`Adding password named: ${name}`)
      if (!tryAddPassword(dispatch, name, salt, hash, hashMethod)) break;
    }
  }
  const onDownload = () => {
    setExportUrl(null);
    setPreppingExport(false);
    return true;
  }

  const importButton = <Button size="sm" variant="primary" onClick={onImport}>Import</Button>;
  const exportButton = exportUrl ? null : <Button size="sm" variant="primary" onClick={onExport} disabled={preppingExport}>Export</Button>;
  const downloadButton = exportUrl && <a className="btn btn-primary btn-sm" onClick={onDownload} download="exported-passwords.json" href={exportUrl}>Download</a>;

  const sendAgree = () => {
    dispatch(setShowSettings(false));
  };
  return (
    <DismissDialog title="Settings Page" show={props.showSettings} onDismiss={sendAgree} className="error-modal">
      {importButton} / {exportButton} {downloadButton} Passwords
      <br />
      <br />
      <Form.Check 
        checked={props.storeHints || false}
        onChange={() => changeSettings(dispatch, SETTINGS_STORE_HINTS, !props.storeHints)}
        id="settings-store-extra-hints"
        type="switch" 
        label="Store extra hints about passwords (less safe)" 
        />
    </DismissDialog>
  )
};

SettingsDialog.propTypes = {
  allPasswords: PropTypes.array.isRequired,
  showSettings: PropTypes.bool.isRequired,
  storeHints: PropTypes.bool,
}

const mapStateToProps = (state, props) => ({
  allPasswords: state.passwordList.list,
  showSettings: state.settings.showSettings,
  storeHints: state.settings.cached[SETTINGS_STORE_HINTS] || false,
});

export const SettingsDialogTestable = SettingsDialog;
export default connect(mapStateToProps)(SettingsDialog);
