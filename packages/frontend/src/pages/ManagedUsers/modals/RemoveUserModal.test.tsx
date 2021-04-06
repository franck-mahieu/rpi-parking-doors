import React from 'react';
import renderer from 'react-test-renderer';
import RemoveUserModal from './RemoveUserModal';

import * as utils from '../../../shared/utils';
import M from 'materialize-css';

jest.mock('../../../shared/utils');

describe('RemoveUserModal', () => {
  let removeUserModal: RemoveUserModal;
  beforeEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
    //@ts-ignore
    utils.fetchUtils.mockResolvedValue(true);
    removeUserModal = new RemoveUserModal({
      login: 'login',
      guid: 'guid',
      getUsers: () => 'user',
    });
  });

  describe('render', () => {
    it('renders correctly', () => {
      const tree = renderer
        .create(
          <RemoveUserModal
            guid={'guid'}
            login={'login'}
            getUsers={'getUsers'}
          />,
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should call onClickUpdatePassword on click on up button', async () => {
      const component = renderer.create(
        <RemoveUserModal guid={'guid'} login={'login'} getUsers={'getUsers'} />,
      );
      const componentInstance: any = component.getInstance();
      jest.spyOn(componentInstance, 'onClickRemoveUser').mockResolvedValue('');
      component.root
        .findByProps({ id: 'remove-user-validate-button' })
        .props.onClick();
      expect(componentInstance.onClickRemoveUser).toHaveBeenCalledWith(
        'login',
        'guid',
      );
    });
  });

  describe('componentDidMount', () => {
    jest.mock('materialize-css');
    it('should call M.Modal.init with valid params', async () => {
      const modalInitMock = jest.fn().mockImplementation((modal, options) => {
        options.onCloseEnd();
      });
      M.Modal.init = modalInitMock;
      await removeUserModal.componentDidMount();
      expect(modalInitMock).toHaveBeenCalledWith(undefined, {
        onCloseEnd: expect.any(Function),
        inDuration: 250,
        outDuration: 250,
        opacity: 0.5,
        dismissible: true,
        startingTop: '4%',
        endingTop: '10%',
      });
    });
  });

  describe('onClickRemoveUser', () => {
    it('should call fetchUtils and call M.toast with green when fetch is in sucess', async () => {
      const toastMock = jest.fn();
      M.toast = toastMock;
      await removeUserModal.onClickRemoveUser('login', 'guid');
      expect(utils.fetchUtils).toHaveBeenCalledWith(
        '/api/users/remove?guid=guid',
        'DELETE',
        '{"login":"login"}',
      );
      expect(toastMock).toBeCalledWith({
        html: 'login a été supprimé avec succès',
        classes: 'green',
      });
    });
    it('should call fetchUtils and call M.toast with red when fetch is in error', async () => {
      const toastMock = jest.fn();
      M.toast = toastMock;
      //@ts-ignore
      utils.fetchUtils.mockRejectedValue();
      await removeUserModal.onClickRemoveUser('login', 'guid');
      expect(utils.fetchUtils).toHaveBeenCalledWith(
        '/api/users/remove?guid=guid',
        'DELETE',
        '{"login":"login"}',
      );
      expect(toastMock).toBeCalledWith({
        html: `login n'a pas été supprimé, une erreur s'est produite`,
        classes: 'red',
      });
    });
  });
});
