import React, { useState } from 'react';
import {connect} from 'react-redux';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import {v4 as uuid4} from 'uuid';

import {addPassword, showError} from '../actions';
import {toHash} from '../lib/hasher.js';
import {updatePassword} from '../store';
import { sleep } from '../lib/utils';

const AddPassword = props => {
  let name;
  let password;
  const [preppingExport, setPreppingExport] = useState(false);
  const [exportUrl, setExportUrl] = useState(null);

  const helpAdd = (name, salt, hash, hashMethod) => {
    let allPasswords = props.allPasswords || [];
    if (allPasswords.some(x => x.name === name)) {
      props.dispatch(showError(
        `There is already a password named "${name}". Please use a different name.`
      ));
      return false;
    }
    updatePassword({name: name, salt: salt, hash: hash, hashMethod: hashMethod})
    props.dispatch(addPassword(name, salt, hash, hashMethod));
    return true;
  }
  const onAdd = () => {
    let hashMethod = "sha512;last2"
    let salt = uuid4().toString();
    let hash = toHash(hashMethod, salt, password.value);
    helpAdd(name.value, salt, hash, hashMethod);
  }
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
      if (!helpAdd(name, salt, hash, hashMethod)) break;
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
  return (
    <Row>
      <Col xs={3} lg={4}><Form.Control ref={x => name=x}/></Col>
      <Col xs={3} lg={4}><Form.Control type="password" autoComplete="off" ref={x => password=x}/></Col>
      <Col xs={3} lg={2} className="action-col">
        <Button variant="primary" onClick={onAdd}>Add</Button>
      </Col>
      <Col xs={3} lg={2} className="action-col buttonMargin">
        {importButton}
        {exportButton}
        {downloadButton}
      </Col>
    </Row>
  );
}

const mapStateToProps = (state, props) => ({
  allPasswords: state.passwordList.list,
});

export const AddPasswordTestable = AddPassword;
export default connect(mapStateToProps)(AddPassword);
