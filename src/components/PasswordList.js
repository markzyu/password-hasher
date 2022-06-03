import React from 'react';
import PropTypes from 'prop-types';

import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';

import './PasswordList.css';
import VerifyPassword from './VerifyPassword.js';
import AddPassword from '../containers/AddPassword.js';
import { TPasswordListWithHandler } from '../lib/types';

export const getColorStyle = hashStr => {
  const hashVal = parseInt(hashStr, 16);
  var color = (
    (((hashVal & 0xf000) * (hashVal & 0xf)) << 4) |
    ((hashVal & 0xf00) * (hashVal & 0xf)) |
    (((hashVal & 0xf0) * (hashVal & 0xf)) >> 4)
  ).toString(16);
  if (color.length < 6) {
    color = '0'.repeat(6 - color.length) + color;
  }

  const colorIntensity = (
    (((hashVal & 0xf000) * (hashVal & 0xf)) >> 12) +
    (((hashVal & 0xf00) * (hashVal & 0xf)) >> 8) +
    (((hashVal & 0xf0) * (hashVal & 0xf)) >> 4)
  ) / 3;
  const textColor = colorIntensity > 128 ? "black" : "white";
  return {
    color: textColor,
    backgroundColor: `#${color}a0`,
    boxShadow: `0.3em 0.1em #${color}50`,
  };
};

const PasswordList = props => {
  const verifyPasswords = props.content.map(item => {
    return (
      <ListGroup.Item key={item.name} style={getColorStyle(item.hash)}>
        <VerifyPassword item={item} onMore={item.onMore}/>
      </ListGroup.Item>
    )
  });
  return (
    <ListGroup data-testid="password-list">
      <ListGroup.Item>
        <Row>
          <Col xs={3} lg={4}>Name</Col>
          <Col xs={3} lg={4}>Password</Col>
          <Col xs={6} lg={4} className="action-col">Actions</Col>
        </Row>
      </ListGroup.Item>
      <ListGroup.Item><AddPassword /></ListGroup.Item>
      {verifyPasswords}
    </ListGroup>
  );
}

PasswordList.propTypes = {
  content: TPasswordListWithHandler.isRequired,
  onAddPassword: PropTypes.func,
};

export default PasswordList;
