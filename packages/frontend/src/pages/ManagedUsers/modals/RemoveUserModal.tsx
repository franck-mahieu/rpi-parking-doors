import React, { Component } from 'react';
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import { fetchUtils } from '../../../shared/utils';
import './Modals.scss';

const {
  REACT_APP_LABEL_REMOVE_BUTTON,
  REACT_APP_REMOVE_USER_MODAL_TITLE,
  REACT_APP_REMOVE_USER_MODAL_DESCRIPTION,
  REACT_APP_LABEL_BUTTON_CANCEL,
  REACT_APP_LABEL_BUTTON_VALIDATE,
  REACT_APP_REMOVE_USER_SUCCESS_MESSAGE,
  REACT_APP_REMOVE_USER_ERROR_MESSAGE,
} = process.env;

interface IRemoveUserModal {
  login: string;
  guid: string;
  getUsers: any;
}

class RemoveUserModal extends Component<IRemoveUserModal> {
  private Modal: any;

  componentDidMount() {
    const options = {
      onCloseEnd: () => {
        this.props.getUsers();
      },
      inDuration: 250,
      outDuration: 250,
      opacity: 0.5,
      dismissible: true,
      startingTop: '4%',
      endingTop: '10%',
    };
    M.Modal.init(this.Modal, options);
  }

  onClickRemoveUser = async (login: string, guid: string) => {
    try {
      await fetchUtils(
        `/api/users/remove?guid=${guid}`,
        'DELETE',
        JSON.stringify({ login: login }),
      );
      M.toast({
        html: `${login} ${REACT_APP_REMOVE_USER_SUCCESS_MESSAGE}`,
        classes: 'green',
      });
    } catch (e) {
      M.toast({
        html: `${login} ${REACT_APP_REMOVE_USER_ERROR_MESSAGE}`,
        classes: 'red',
      });
    }
  };

  render() {
    return (
      <span id={'user-modal'}>
        <button
          className="waves-effect waves-light btn modal-trigger user-modal remove-button"
          data-target={`remove-user-modal-${this.props.login}`}
          title={REACT_APP_REMOVE_USER_MODAL_TITLE}
        >
          {REACT_APP_LABEL_REMOVE_BUTTON}
        </button>
        <div
          ref={Modal => {
            this.Modal = Modal;
          }}
          id={`remove-user-modal-${this.props.login}`}
          className="modal"
        >
          <div className="modal-content">
            <h4>
              {REACT_APP_REMOVE_USER_MODAL_TITLE} {this.props.login}
            </h4>
            <p>
              {REACT_APP_REMOVE_USER_MODAL_DESCRIPTION} {this.props.login} ?
            </p>
          </div>
          <div className="modal-footer">
            <button className="modal-close waves-effect waves-red btn-flat cancel-button">
              {REACT_APP_LABEL_BUTTON_CANCEL}
            </button>
            <button
              id={'remove-user-validate-button'}
              className="modal-close waves-effect waves-green btn-flat"
              onClick={async () => {
                await this.onClickRemoveUser(this.props.login, this.props.guid);
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

export default RemoveUserModal;
