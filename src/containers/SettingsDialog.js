import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DismissDialog from '../components/DismissDialog';
import { setShowSettings, tryAddPassword } from '../actions';
import { sleep } from '../lib/utils';
import Button from 'react-bootstrap/Button';

const SettingsDialog = props => {
  const [preppingExport, setPreppingExport] = useState(false);
  const [exportUrl, setExportUrl] = useState(null);

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
      if (!tryAddPassword(props.dispatch, name, salt, hash, hashMethod)) break;
    }
  }
  const onDownload = () => {
    setExportUrl(null);
    setPreppingExport(false);
    return true;
  }

  const importButton = <Button variant="primary" onClick={onImport}>Import</Button>;
  const exportButton = exportUrl ? null : <Button variant="primary" onClick={onExport} disabled={preppingExport}>Export</Button>;
  const downloadButton = exportUrl && <a className="btn btn-primary" onClick={onDownload} download="exported-passwords.json" href={exportUrl}>Download</a>;

  const sendAgree = () => {
    props.dispatch(setShowSettings(false));
  };
  return (
    <DismissDialog title="Settings Page" show={props.showSettings} onDismiss={sendAgree} className="error-modal">
      Import / Export Passwords: {importButton} {exportButton} {downloadButton}
    </DismissDialog>
  )
};

SettingsDialog.propTypes = {
  allPasswords: PropTypes.array.isRequired,
  showSettings: PropTypes.bool.isRequired,
}

const mapStateToProps = (state, props) => ({
  allPasswords: state.passwordList.list,
  showSettings: state.settings.showSettings,
});

export const SettingsDialogTestable = SettingsDialog;
export default connect(mapStateToProps)(SettingsDialog);
