import React from 'react';
import renderer from 'react-test-renderer';
import UpdatePasswordModal from './UpdatePasswordModal';

import * as utils from '../../../shared/utils';
import M from 'materialize-css';

jest.mock('../../../shared/utils');

describe('UpdatePasswordModal', () => {
  let updatePasswordModal: UpdatePasswordModal;
  beforeEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
    //@ts-ignore
    utils.fetchUtils.mockResolvedValue(true);
    updatePasswordModal = new UpdatePasswordModal({
      login: 'login',
      guid: 'guid',
    });
  });

  describe('render', () => {
    it('renders correctly', () => {
      const tree = renderer
        .create(<UpdatePasswordModal guid={'guid'} login={'login'} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should call onClickUpdatePassword on click on up button', () => {
      const component = renderer.create(
        <UpdatePasswordModal guid={'guid'} login={'login'} />,
      );
      const componentInstance: any = component.getInstance();
      componentInstance.onChangePasswordHandler({
        target: { value: 'new password' },
      });
      jest
        .spyOn(componentInstance, 'onClickUpdatePassword')
        .mockResolvedValue('');
      component.root
        .findByProps({ id: 'update-password-validate-button' })
        .props.onClick();
      expect(componentInstance.onClickUpdatePassword).toHaveBeenCalledWith(
        'login',
        'new password',
        'guid',
      );
    });
  });

  describe('componentDidMount', () => {
    jest.mock('materialize-css');
    it('should call M.Modal.init with valid params', async () => {
      const modalInitMock = jest.fn().mockImplementation((modal, options) => {
        options.onOpenStart();
      });
      M.Modal.init = modalInitMock;
      const setStateMock = jest.fn();
      updatePasswordModal.setState = setStateMock;
      updatePasswordModal.componentDidMount();
      expect(modalInitMock).toHaveBeenCalledWith(undefined, {
        onOpenStart: expect.any(Function),
        inDuration: 250,
        outDuration: 250,
        opacity: 0.5,
        dismissible: true,
        startingTop: '4%',
        endingTop: '10%',
      });
      expect(setStateMock).toHaveBeenCalledWith({
        password: '',
      });
    });
  });

  describe('onClickUpdatePassword', () => {
    it('should call fetchUtils and call M.toast with green when fetch is in sucess', async () => {
      const toastMock = jest.fn();
      M.toast = toastMock;
      await updatePasswordModal.onClickUpdatePassword(
        'login',
        'password',
        'guid',
      );
      expect(utils.fetchUtils).toHaveBeenCalledWith(
        '/api/users/updatepassword?guid=guid',
        'POST',
        '{"login":"login","password":"password"}',
      );
      expect(toastMock).toBeCalledWith({
        html: 'login, le mot de passe a été mis à jour avec succès',
        classes: 'green',
      });
    });
    it('should call fetchUtils and call M.toast with red when fetch is in error', async () => {
      const toastMock = jest.fn();
      M.toast = toastMock;
      //@ts-ignore
      utils.fetchUtils.mockRejectedValue();
      await updatePasswordModal.onClickUpdatePassword(
        'login',
        'password',
        'guid',
      );
      expect(utils.fetchUtils).toHaveBeenCalledWith(
        '/api/users/updatepassword?guid=guid',
        'POST',
        '{"login":"login","password":"password"}',
      );
      expect(toastMock).toBeCalledWith({
        html: `login, le mot de passe n'a pas été mis à jour, une erreur s'est produite`,
        classes: 'red',
      });
    });
  });

  describe('onChangePasswordHandler', () => {
    it('should call setState with pasword received', () => {
      const setStateMock = jest.fn();
      updatePasswordModal.setState = setStateMock;
      updatePasswordModal.onChangePasswordHandler({
        target: { value: 'password' },
      });
      expect(setStateMock).toHaveBeenCalledWith({ password: 'password' });
    });

    it('should call setState with undefined when received empty event', () => {
      const setStateMock = jest.fn();
      updatePasswordModal.setState = setStateMock;
      updatePasswordModal.onChangePasswordHandler({});
      expect(setStateMock).toHaveBeenCalledWith({ password: undefined });
    });
  });
});
