import React from 'react';
import renderer from 'react-test-renderer';
import AddUserModal from './AddUserModal';

import * as utils from '../../../shared/utils';
import M from 'materialize-css';

jest.mock('../../../shared/utils');

describe('AddUserModal', () => {
  let addUserModal: AddUserModal;
  beforeEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
    //@ts-ignore
    utils.fetchUtils.mockResolvedValue(true);
    addUserModal = new AddUserModal({ guid: 'guid' });
  });

  describe('render', () => {
    it('renders correctly', () => {
      const tree = renderer
        .create(<AddUserModal guid={'guid'} getUsers={jest.fn()} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should call onClickAddUser on click on button', () => {
      const component = renderer.create(
        <AddUserModal guid={'guid'} getUsers={jest.fn()} />,
      );
      const componentInstance: any = component.getInstance();
      jest.spyOn(componentInstance, 'onClickAddUser').mockResolvedValue('');
      component.root
        .findByProps({ id: 'add-user-validate-button' })
        .props.onClick();
      expect(componentInstance.onClickAddUser).toHaveBeenCalled();
    });
  });

  describe('componentDidMount', () => {
    jest.mock('materialize-css');
    it('should call M.Modal.init with valid params', async () => {
      const modalInitMock = jest.fn().mockImplementation((modal, options) => {
        options.onOpenStart();
      });
      const formSelectInitMock = jest.fn();
      const datePickerInitMock = jest
        .fn()
        .mockImplementation((modal, options) => {
          options.onSelect(new Date(2021, 3, 9));
        });
      M.Modal.init = modalInitMock;
      M.FormSelect.init = formSelectInitMock;
      M.Datepicker.init = datePickerInitMock;
      const setStateMock = jest.fn();
      addUserModal.setState = setStateMock;
      addUserModal.componentDidMount();
      expect(modalInitMock).toHaveBeenCalledWith(undefined, {
        onOpenStart: expect.any(Function),
        inDuration: 250,
        outDuration: 250,
        opacity: 0.5,
        dismissible: true,
        startingTop: '4%',
        endingTop: '10%',
      });
      expect(setStateMock).toHaveBeenNthCalledWith(1, {
        email: '',
        expiration: '',
        login: '',
        password: '',
        roles: 'user',
      });
      expect(setStateMock).toHaveBeenNthCalledWith(2, {
        expiration: new Date(2021, 3, 9, 12, 0, 0),
      });
    });
  });

  describe('onClickAddUser', () => {
    let toastMock: any;
    let componentInstance: any;
    beforeEach(() => {
      toastMock = jest.fn();
      M.toast = toastMock;
      const component = renderer.create(
        <AddUserModal guid={'guid'} getUsers={jest.fn()} />,
      );
      componentInstance = component.getInstance();
      componentInstance.setState({
        login: 'login',
        password: 'password',
        roles: 'user',
        email: 'email',
        expiration: 'expiration',
      });
    });

    it('should call fetchUtils and call M.toast with green when fetch is in sucess', async () => {
      await componentInstance.onClickAddUser();
      expect(utils.fetchUtils).toHaveBeenCalledWith(
        '/api/users/add?guid=guid',
        'PUT',
        '{"login":"login","password":"password","roles":"user","email":"email","expiration":"expiration"}',
      );
      expect(toastMock).toBeCalledWith({
        html: 'login a été ajouté avec succès',
        classes: 'green',
      });
    });

    it('should call fetchUtils and call M.toast with red when fetch is in error', async () => {
      //@ts-ignore
      utils.fetchUtils.mockRejectedValue();
      await componentInstance.onClickAddUser();
      expect(utils.fetchUtils).toHaveBeenCalledWith(
        '/api/users/add?guid=guid',
        'PUT',
        '{"login":"login","password":"password","roles":"user","email":"email","expiration":"expiration"}',
      );
      expect(toastMock).toBeCalledWith({
        html: "login n'a pas été ajouté, une erreur s'est produite",
        classes: 'red',
      });
    });
  });

  describe('onChangeHandler', () => {
    it('should call setState with key and value received', () => {
      const setStateMock = jest.fn();
      addUserModal.setState = setStateMock;
      addUserModal.onChangeHandler({
        target: { id: 'id', value: 'value' },
      });
      expect(setStateMock).toHaveBeenCalledWith({ id: 'value' });
    });

    it('should not call setState when received empty event', () => {
      const setStateMock = jest.fn();
      addUserModal.setState = setStateMock;
      addUserModal.onChangeHandler({});
      expect(setStateMock).not.toHaveBeenCalled();
    });
  });
});
