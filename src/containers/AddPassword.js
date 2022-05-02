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

  const onAdd = () => {
    let hashMethod = "sha512;last2"
    let salt = uuid4().toString();
    let hash = toHash(hashMethod, salt, password.value);
    let allPasswords = props.allPasswords || [];
    if (allPasswords.some(x => x.name === name.value)) {
      return props.dispatch(showError(
        `There is already a password named "${name.value}". Please use a different name.`
      ));
    }
    updatePassword({name: name.value, salt: salt, hash: hash, hashMethod: hashMethod})
    props.dispatch(addPassword(name.value, salt, hash, hashMethod));
  }
  const onExport = async () => {
    setPreppingExport(true);
    await sleep(1000);
    const str = JSON.stringify(props.allPasswords);
    const blob = new Blob([str], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    setExportUrl(url);
  }
  /**
  const onImport = () => {
    props.dispatch(showError("Not implemented."));
  }
  **/
  const onDownload = () => {
    setExportUrl(null);
    setPreppingExport(false);
    return true;
  }

  // const importButton = <Button variant="primary" onClick={onImport}>Import</Button>;
  const exportButton = exportUrl ? null : <Button variant="primary" onClick={onExport} disabled={preppingExport}>Export</Button>;
  const downloadButton = exportUrl && <a className="btn btn-primary" onClick={onDownload} download="exported-passwords.json" href={exportUrl}>Download</a>;
  return (
    <Row>
      <Col xs={3} lg={4}><Form.Control ref={x => name=x}/></Col>
      <Col xs={3} lg={4}><Form.Control type="password" ref={x => password=x}/></Col>
      <Col xs={3} lg={2} className="action-col">
        <Button variant="primary" onClick={onAdd}>Add</Button>
      </Col>
      <Col xs={3} lg={2} className="action-col buttonMargin">
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
