import React from 'react';
import PropTypes from 'prop-types';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const DismissDialog = props => {
  return (
    <Modal show={props.show} onHide={props.onDismiss} className="passwd-detail-modal">
      <Modal.Header closeButton>{props.title}</Modal.Header>
      <Modal.Body>
        {props.children}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onDismiss}>Dismiss</Button>
      </Modal.Footer>
    </Modal>
  )
};

DismissDialog.propTypes = {
  children: PropTypes.node.isRequired,
  onDismiss: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
}

export default DismissDialog;
