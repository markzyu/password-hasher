import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DismissDialog from '../components/DismissDialog';
import { dismissPasswdDetails } from '../actions';

const PasswdDetailDialog = props => {
  const sendClose = () => props.dispatch(dismissPasswdDetails());
  return (
    <DismissDialog show={props.show} onDismiss={sendClose} className="passwd-detail-modal" title="What is stored">
      Instead of storing your real password, we stored its hash value. As a result, we can only check passwords against this value, and cannot retrieve the original password.
      <br/>
      Additionally, we made sure the hash value cannot be used by attackers to enumerate your password, by deliberately including random regular English words as possible correct passwords. In fact, all of the following English words will also be seen as the correct password for this item:
      <pre>{props.possibleMatches.join("\n")}</pre>
    </DismissDialog>
  )
};

PasswdDetailDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  possibleMatches: PropTypes.arrayOf(PropTypes.string).isRequired,
}

const mapStateToProps = (state, props) => ({
  show: state.passwordDetail.show,
  possibleMatches: state.passwordDetail.possibleMatches || [],
});

export const PasswdDetailDialogTestable = PasswdDetailDialog;
export default connect(mapStateToProps)(PasswdDetailDialog);
