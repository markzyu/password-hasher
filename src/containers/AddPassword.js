import React from 'react';
import {connect} from 'react-redux';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import {v4 as uuid4} from 'uuid';

import {setShowSettings, tryAddPassword} from '../actions';
import {toHash, toPartsHash} from '../lib/hasher.js';
import { SETTINGS_STORE_HINTS } from '../lib/utils';

const AddPassword = props => {
  let name;
  let password;

  const onAdd = () => {
    let hashMethod = "sha512;last2"
    let salt = uuid4().toString();
    let hash = toHash(hashMethod, salt, password.value);

    var partsHashMethod = undefined
    var partsHash = undefined
    if (props.storeHints) {
      partsHashMethod = "sha512;last1"
      partsHash = toPartsHash(partsHashMethod, salt, password.value);
    }

    if (tryAddPassword(props.dispatch, name.value, salt, hash, hashMethod, partsHash, partsHashMethod)) {
      name.value = '';
      password.value = '';
    }
  }

  const onSettings = () => {
    props.dispatch(setShowSettings(true));
  }

  return (
    <Row>
      <Col xs={3} lg={4}><Form.Control aria-label='Name' ref={x => name=x}/></Col>
      <Col xs={3} lg={4}><Form.Control aria-label='Password' type="password" autoComplete="off" ref={x => password=x}/></Col>
      <Col xs={3} lg={2} className="action-col">
        <Button variant="primary" onClick={onAdd}>Add</Button>
      </Col>
      <Col xs={3} lg={2} className="action-col">
        <Button variant="primary" onClick={onSettings}>Settings</Button>
      </Col>
    </Row>
  );
}

const mapStateToProps = (state, props) => ({
  allPasswords: state.passwordList.list,
  storeHints: state.settings.cached[SETTINGS_STORE_HINTS] || false,
});

export const AddPasswordTestable = AddPassword;
export default connect(mapStateToProps)(AddPassword);
