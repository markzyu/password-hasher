import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DismissDialog from '../components/DismissDialog';
import { setShowSettings } from '../actions';

const UADialog = props => {
  const sendAgree = () => {
    props.dispatch(setShowSettings(false));
  };
  return (
    <DismissDialog title="Settings" show={props.showSettings} onDismiss={sendAgree} className="error-modal">
      Import / Export Passwords: 
    </DismissDialog>
  )
};

UADialog.propTypes = {
  showSettings: PropTypes.bool.isRequired,
}

const mapStateToProps = (state, props) => ({
  showSettings: !state.settings.showSettings,
});

export const UADialogTestable = UADialog;
export default connect(mapStateToProps)(UADialog);
