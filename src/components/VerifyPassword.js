import React from 'react';
import PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';

import {toHash} from '../lib/hasher.js';
import DeletePassword from '../containers/DeletePassword.js';

const VerifyPassword = props => {
  const [hasChecked, setHasChecked] = React.useState(false);
  const [pass, setPass] = React.useState("");
  const passOk = toHash(props.hashMethod, props.salt, pass) === props.hash;
  const btnTxt = hasChecked ? "More.." : "Check";
  const btnAction = () => {
    if (hasChecked && props.onMore) props.onMore();
    setHasChecked(true);
  };
  const editAction = event => {
    setHasChecked(false);
    setPass(event.target.value);
  };
  const keyAction = event => event.key === "Enter" && btnAction();
  return (
    <Row>
      <Col xs={3} lg={4}>{props.name}</Col>
      <Col xs={3} lg={4}><InputGroup>
        <Form.Control 
          data-testid="verify-password:input"
          value={pass}
          type="password" 
          autoComplete="off"
          isInvalid={hasChecked && !passOk} 
          isValid={hasChecked && passOk}
          onChange={editAction} 
          onKeyPress={keyAction}/>
        <Form.Control.Feedback type="invalid">
          Wrong Password
        </Form.Control.Feedback>
      </InputGroup></Col>
      <Col xs={3} lg={2} className="action-col">
        <Button variant="primary" onClick={btnAction}>{btnTxt}</Button>
      </Col>
      <Col xs={3} lg={2} className="action-col">
        <DeletePassword name={props.name}/>
      </Col>
    </Row>
  );
}

VerifyPassword.propTypes = {
  onMore: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  salt: PropTypes.string.isRequired,
  hash: PropTypes.string.isRequired,
  hashMethod: PropTypes.string.isRequired,
}

export default VerifyPassword;
