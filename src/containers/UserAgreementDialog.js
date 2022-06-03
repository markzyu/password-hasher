import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DismissDialog from '../components/DismissDialog';
import { loadAgreementStatus } from '../actions';
import { getAgreementRead, setAgreementRead } from '../store';

const UADialog = props => {
  const sendAgree = () => {
    setAgreementRead(true);
    props.dispatch(loadAgreementStatus(getAgreementRead()));
  };
  return (
    <DismissDialog title="User Agreement" show={props.showAgreement} onDismiss={sendAgree} className="error-modal">
        <em>By using this app, you agree to the following terms. If you do not agree, please DO NOT USE THIS APP.</em>
        <br/>
        <br/>
        This app is for testing and educational purposes only. There is no warranty. Please don't use this app to store actual passwords.
        <br/>
        <br/>
        Privacy Policy: This app doesn't collect any information remotely. Any data collected by this app is stored locally on your own computer. You can delete such data by clearing cookies and local storage of your browser. This app doesn't target children specifically. IF YOU ARE UNDER THE AGE OF 21, DO NOT USE THIS APP.
        <br/>
        <br/>
        This software is provided to you
          via <a href={"https://github.com/markzyu/password-hasher/blob/master/LICENSE"}>the MIT license</a>. 
        This software uses third party dependencies listed <a href={"https://github.com/markzyu/password-hasher/blob/master/package.json"}>here</a>.
    </DismissDialog>
  )
};

UADialog.propTypes = {
  showAgreement: PropTypes.bool.isRequired,
}

const mapStateToProps = (state, props) => ({
  showAgreement: !state.agreement.agreed,
});

export const UADialogTestable = UADialog;
export default connect(mapStateToProps)(UADialog);
