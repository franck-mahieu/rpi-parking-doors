import React, { Component } from 'react';
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import { fetchUtils } from '../../../shared/utils';
import './Modals.scss';

const {
  REACT_APP_UPDATE_PASSWORD_MODAL_TITLE,
  REACT_APP_UPDATE_PASSWORD_SUCCESS_MESSAGE,
  REACT_APP_UPDATE_PASSWORD_ERROR_MESSAGE,
  REACT_APP_LABEL_BUTTON_CANCEL,
  REACT_APP_LABEL_BUTTON_VALIDATE,
  REACT_APP_LABEL_PASSORD,
  REACT_APP_LABEL_UPDATE_PASSWORD_BUTTON,
} = process.env;

interface IUpdatePasswordModal {
  login: string;
  guid: string;
}

interface IUpdatePasswordModalState {
  password: string | undefined;
}

class UpdatePasswordModal extends Component<IUpdatePasswordModal> {
  private Modal: any;
  public state: IUpdatePasswordModalState;

  constructor(props: IUpdatePasswordModal) {
    super(props);
    this.state = {
      password: '',
    };
  }

  componentDidMount() {
    const onOpenStart = () => {
      this.setState({
        password: '',
      });
    };
    const options = {
      onOpenStart,
      inDuration: 250,
      outDuration: 250,
      opacity: 0.5,
      dismissible: true,
      startingTop: '4%',
      endingTop: '10%',
    };
    M.Modal.init(this.Modal, options);
  }

  onClickUpdatePassword = async (
    login: string,
    password: string | undefined,
    guid: string,
  ) => {
    try {
      await fetchUtils(
        `/api/users/updatepassword?guid=${guid}`,
        'POST',
        JSON.stringify({ login, password }),
      );
      M.toast({
        html: `${login}${REACT_APP_UPDATE_PASSWORD_SUCCESS_MESSAGE}`,
        classes: 'green',
      });
    } catch (e) {
      M.toast({
        html: `${login}${REACT_APP_UPDATE_PASSWORD_ERROR_MESSAGE}`,
        classes: 'red',
      });
    }
  };

  onChangePasswordHandler = (event: any) => {
    this.setState({
      password: event?.target?.value,
    });
  };

  render() {
    return (
      <span id={'user-modal'}>
        <button
          className="waves-effect waves-light btn modal-trigger update-password-button"
          data-target={`update-user-password-modal-${this.props.login}`}
          title={REACT_APP_LABEL_UPDATE_PASSWORD_BUTTON}
        >
          {REACT_APP_LABEL_UPDATE_PASSWORD_BUTTON}
        </button>

        <div
          ref={Modal => {
            this.Modal = Modal;
          }}
          id={`update-user-password-modal-${this.props.login}`}
          className="modal"
        >
          <div className="modal-content">
            <h4>
              {REACT_APP_UPDATE_PASSWORD_MODAL_TITLE} {this.props.login}
            </h4>
            <div className="row">
              <div className="input-field col s12">
                <input
                  id={`update-password-${this.props.login}`}
                  type="text"
                  className="validate"
                  value={this.state.password}
                  onChange={this.onChangePasswordHandler}
                />
                <label htmlFor="password">{REACT_APP_LABEL_PASSORD}</label>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="modal-close waves-effect waves-red btn-flat cancel-button">
              {REACT_APP_LABEL_BUTTON_CANCEL}
            </button>
            <button
              id={'update-password-validate-button'}
              className="modal-close waves-effect waves-green btn-flat"
              onClick={async () => {
                await this.onClickUpdatePassword(
                  this.props.login,
                  this.state.password,
                  this.props.guid,
                );
              }}
            >
              {REACT_APP_LABEL_BUTTON_VALIDATE}
            </button>
          </div>
        </div>
      </span>
    );
  }
}

export default UpdatePasswordModal;
