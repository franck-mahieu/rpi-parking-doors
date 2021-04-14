import React, { Component } from 'react';
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import { fetchUtils } from '../../../shared/utils';
import './Modals.scss';

const {
  REACT_APP_LABEL_ADD_USER_BUTTON,
  REACT_APP_LABEL_LOGIN,
  REACT_APP_LABEL_PASSWORD,
  REACT_APP_LABEL_ROLES,
  REACT_APP_ADD_USER_SUCCESS_MESSAGE,
  REACT_APP_ADD_USER_ERROR_MESSAGE,
  REACT_APP_LABEL_BUTTON_CANCEL,
  REACT_APP_LABEL_BUTTON_VALIDATE,
  REACT_APP_ADD_USER_MODAL_TITLE,
} = process.env;

interface IAddUserModal {
  guid: string;
  getUsers: any;
}

interface IAddUserModalState {
  login?: string;
  password?: string;
  roles?: string;
  email?: string;
  expiration?: string;
}

class AddUserModal extends Component<IAddUserModal> {
  private Modal: any;
  state: IAddUserModalState;

  constructor(props: any) {
    super(props);
    this.state = {
      login: '',
      password: '',
      roles: 'user',
      email: '',
      expiration: '',
    };
  }

  componentDidMount() {
    const options = {
      onOpenStart: () => {
        this.setState({
          login: '',
          password: '',
          roles: 'user',
          email: '',
          expiration: '',
        });
      },
      inDuration: 250,
      outDuration: 250,
      opacity: 0.5,
      dismissible: true,
      startingTop: '4%',
      endingTop: '10%',
    };

    M.Modal.init(this.Modal, options);
    const selectElement = document.querySelectorAll('select');
    M.FormSelect.init(selectElement);
    const datePickerElement = document.querySelectorAll('.datepicker');
    M.Datepicker.init(datePickerElement, {
      minDate: new Date(),
      defaultDate: new Date(),
      autoClose: true,
      showClearBtn: true,
      onSelect: date => {
        // usefull to keep the date of the selected day in different timezone
        date.setHours(12, 0, 0);
        this.setState({
          expiration: date,
        });
      },
    });
  }

  onClickAddUser = async () => {
    const { login, password, roles, email, expiration } = this.state;
    try {
      await fetchUtils(
        `/api/users/add?guid=${this.props.guid}`,
        'PUT',
        JSON.stringify({ login, password, roles, email, expiration }),
      );
      M.toast({
        html: `${login} ${REACT_APP_ADD_USER_SUCCESS_MESSAGE}`,
        classes: 'green',
      });
      this.props.getUsers();
    } catch (e) {
      M.toast({
        html: `${login} ${REACT_APP_ADD_USER_ERROR_MESSAGE}`,
        classes: 'red',
      });
    }
  };

  onChangeHandler = (event: any) => {
    if (event?.target?.id)
      this.setState({
        [event?.target?.id]: event?.target?.value,
      });
  };

  render() {
    return (
      <span id={'user-modal'}>
        <button
          className="waves-effect waves-light btn modal-trigger add-user-button"
          data-target="add-user-modal"
          title={REACT_APP_LABEL_ADD_USER_BUTTON}
        >
          {REACT_APP_LABEL_ADD_USER_BUTTON}
        </button>

        <div
          ref={Modal => {
            this.Modal = Modal;
          }}
          id="add-user-modal"
          className="modal"
        >
          <div className="modal-content">
            <h4>{REACT_APP_ADD_USER_MODAL_TITLE}</h4>
            <div className="row">
              <div className="input-field col s12">
                <input
                  id="login"
                  type="text"
                  className="validate"
                  value={this.state.login}
                  onChange={this.onChangeHandler}
                />
                <label htmlFor="login">{REACT_APP_LABEL_LOGIN}</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <input
                  id="password"
                  type="text"
                  className="validate"
                  value={this.state.password}
                  onChange={this.onChangeHandler}
                />
                <label htmlFor="password">{REACT_APP_LABEL_PASSWORD}</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <select onChange={this.onChangeHandler} id={'roles'}>
                  <option value="" disabled>
                    Choose the roles
                  </option>
                  <option value={'user'}>user</option>
                  <option value={'user admin'}>admin</option>
                </select>
                <label>{REACT_APP_LABEL_ROLES}</label>
              </div>
            </div>

            <div className="row">
              <div className="input-field col s12">
                <input
                  id="email"
                  type="email"
                  className="validate"
                  value={this.state.email}
                  onChange={this.onChangeHandler}
                />
                <label htmlFor="email">Email</label>
              </div>
            </div>

            <div className="row">
              <div className="input-field col s12">
                <input id="expiration" type="text" className="datepicker" />
                <label htmlFor="expiration">Expiration</label>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="modal-close waves-effect waves-red btn-flat cancel-button">
              {REACT_APP_LABEL_BUTTON_CANCEL}
            </button>
            <button
              id={'add-user-validate-button'}
              className="modal-close waves-effect waves-green btn-flat"
              onClick={async () => {
                await this.onClickAddUser();
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

export default AddUserModal;
