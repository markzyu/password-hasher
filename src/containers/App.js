import React from 'react';
import {connect} from 'react-redux';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import ErrorDialog from './ErrorDialog.js';
import {loadPasswords, showPasswdDetails} from '../actions';
import {getPasswords} from '../store';
import {genGuessesFromHash} from '../lib/hasher';
import PasswdDetailDialog from './PasswdDetailDialog.js';
import PasswordList from '../components/PasswordList.js';
import './App.css';
import UserAgreementDialog from './UserAgreementDialog.js';
import SettingsDialog from './SettingsDialog.js';
import { TPasswordList } from '../lib/types.js';

const App = props => {
  var maybePasswordList = (<pre>Loading...</pre>);
  if (!props.contentLoaded) {
    setTimeout(() => props.dispatch(loadPasswords(getPasswords())), 500);
  } else {
    const content = props.content.map((item) => {
      item.onMore = () => {
        const possibleMatches = genGuessesFromHash(item.hashMethod, item.salt, item.hash, true)
        props.dispatch(showPasswdDetails(possibleMatches))
      }
      return item
    });
    maybePasswordList = (<PasswordList content={content}/>);
  }
  return (
    <Container>
      <Row>
        <Col>
          {maybePasswordList}
        </Col>
      </Row>
      <ErrorDialog />
      <PasswdDetailDialog />
      <UserAgreementDialog />
      <SettingsDialog />
    </Container>
  );
}

App.propTypes = {
  content: TPasswordList.isRequired,
}

const mapStateToProps = (state, props) => ({
  content: state.passwordList.list,
  contentLoaded: state.passwordList.loaded,
})

export default connect(mapStateToProps)(App);
