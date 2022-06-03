import React from 'react';
import PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';

import {toHash, toPartsHash} from '../lib/hasher.js';
import DeletePassword from '../containers/DeletePassword.js';
import { TPassword } from '../lib/types.js';

const VerifyPassword = props => {
  const [hasChecked, setHasChecked] = React.useState(false);
  const [hasFocus, setHasFocus] = React.useState(false);
  const [pass, setPass] = React.useState("");
  const item = props.item;

  const passOk = toHash(item.hashMethod, item.salt, pass) === item.hash;
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

  var hints = null;
  if (hasFocus && item.partsHash && item.partsHashMethod) {
    const greenLine = {outline: "2px solid lime"};
    const redLine = {outline: "2px solid red"};

    const parts = toPartsHash(item.partsHashMethod, item.salt, pass);
    const size = Math.floor(12 / parts.length);
    const bars = parts.map((hashVal, i) => {
      const partOk = hashVal === item.partsHash[i];
      const describePartOk = partOk ? "correct" : "incorrect"
      const label = `Part ${i + 1} of the password is ${describePartOk}`
      return <Col key={i} aria-label={label} xs={size} lg={size} style={partOk ? greenLine : redLine}></Col>
    })
    hints = (
      <Row style={{marginLeft: "2px", marginRight: "2px", marginTop: "5px"}}>
        {bars}
      </Row>
    )
  }

  return (
    <Row>
      <Col xs={3} lg={4}>{item.name}</Col>
      <Col xs={3} lg={4}>
        <InputGroup>
          <Form.Control 
            data-testid="verify-password:input"
            value={pass}
            type="password" 
            autoComplete="off"
            onFocus={() => setHasFocus(true)}
            onBlur={() => setHasFocus(false)}
            isInvalid={hasChecked && !passOk} 
            isValid={hasChecked && passOk}
            onChange={editAction} 
            onKeyPress={keyAction}/>
          <Form.Control.Feedback type="invalid">
            Wrong Password
          </Form.Control.Feedback>
        </InputGroup>
        {hints}
      </Col>
      <Col xs={3} lg={2} className="action-col">
        <Button variant="primary" onClick={btnAction}>{btnTxt}</Button>
      </Col>
      <Col xs={3} lg={2} className="action-col">
        <DeletePassword name={item.name}/>
      </Col>
    </Row>
  );
}

VerifyPassword.propTypes = {
  onMore: PropTypes.func.isRequired,
  item: TPassword.isRequired,
}

export default VerifyPassword;
