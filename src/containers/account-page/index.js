import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { PasswordForgetForm } from '../../containers/password-forget-page';
import PasswordChangeForm from './pw-change-form';
import { withAuthorization } from '../../components/Session';
import { withFirebase } from '../../components/Firebase';

import * as ROUTES from '../../constants/routes';
import * as actions from './constants';
import { compose } from 'recompose';

class AccountChangeForm extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      tagline: '',
      profilePicture: '',
      updated: false,
    }
  }

  onSubmit = event => {
    const { tagline, profilePicture, username } = this.state;
    let uid = this.props.firebase.auth.currentUser.uid;
    let email = this.props.firebase.auth.currentUser.email;

    this.props.firebase
      .user(uid)
        .set({
          username,
          email,
          tagline,
          profilePicture,
        })

    event.preventDefault();
    this.setState({ updated: true })
    this.props.history.push(ROUTES.HOME);
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    console.log('this.propf.firebase', this.props.firebase)
    const { tagline, profilePicture } = this.state;

    const isInvalid = tagline === '' || profilePicture === '';

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="username"
          value={this.state.username}
          onChange={this.onChange}
          type="text"
          placeholder="username"
        />
        <input
          name="tagline"
          value={this.state.tagline}
          onChange={this.onChange}
          type="text"
          placeholder="tagline..."
        />
        <input
          name="profilePicture"
          value={this.state.profilePicture}
          onChange={this.onChange}
          type="text"
          placeholder="profilePicture..."
        />
        <button disabled={isInvalid} type="submit">
          Update My Deets
        </button>

      </form>
    );
  }
}


const AccountPage = (props) => {

  useEffect(() => {
    props.pageLoading();
  });

  useEffect(() => {
    props.pageLoaded();
  });

  return (
      <div>
        <h1>Account Page</h1>
        <PasswordForgetForm />
        <PasswordChangeForm />
        <AccountChangeForm {...props} />
      </div>
  );
}


const mapStateToProps = state => ({
  isLoading: state.accountPage.isLoading,
});

const mapDispatchToProps = dispatch => ({
  pageLoading: () => dispatch({ type: actions.ACCOUNT_PAGE_LOADING }),
  pageLoaded: () => dispatch({ type: actions.ACCOUNT_PAGE_LOADED }),
});

const condition = authUser => !!authUser;

export default compose(
  withFirebase,
  withAuthorization(condition),
  connect(mapStateToProps, mapDispatchToProps),
)(AccountPage);
