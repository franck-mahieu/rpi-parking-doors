import { isActive, Navbar } from './Navbar';
import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import React from 'react';
import renderer, { act } from 'react-test-renderer';

require('jest-specific-snapshot');

jest.mock('../../shared/utils');
const utils = require('../../shared/utils');

describe('Navbar.tsx', () => {
  describe('Navbar', () => {
    let component: any;
    beforeEach(async () => {
      jest.resetModules();
      jest.resetAllMocks();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should not call fetchUtils when userRoles is already set', async () => {
      React.useState = jest.fn().mockReturnValue(['toto', {}]);
      await act(async () => {
        component = renderer.create(
          <MemoryRouter>
            <Navbar
              setGuid={() => {}}
              guid={'guid'}
              setUserRoles={() => {}}
              userRoles={'admin'}
            />
          </MemoryRouter>,
        );
      });
      expect(utils.fetchUtils).not.toHaveBeenCalled();
    });

    it('should renders correctly when fetchUtils return correct roles and guid', async () => {
      utils.fetchUtils.mockResolvedValue({
        guid: 'guid',
        roles: 'roles',
      });
      await act(async () => {
        const history = createMemoryHistory();
        history.push = jest.fn();
        component = renderer.create(
          <Router history={history}>
            <Navbar
              setGuid={() => {}}
              guid={null}
              setUserRoles={() => {}}
              userRoles={null}
            />
          </Router>,
        );
      });
      expect(component.toJSON()).toMatchSnapshot();
    });

    it('should renders correctly when fetchUtils return empty guid', async () => {
      utils.fetchUtils.mockResolvedValue({
        guid: null,
        roles: 'roles',
      });
      await act(async () => {
        const history = createMemoryHistory();
        component = renderer.create(
          <Router history={history}>
            <Navbar
              setGuid={() => {}}
              guid={null}
              setUserRoles={() => {}}
              userRoles={null}
            />
          </Router>,
        );
      });
      expect(component.toJSON()).toMatchSnapshot();
    });

    it('should renders correctly when fetchUtils return admin roles and guid', async () => {
      utils.fetchUtils.mockResolvedValue({
        guid: 'guid',
        roles: 'admin',
      });
      await act(async () => {
        const history = createMemoryHistory();
        history.push = jest.fn();
        component = renderer.create(
          <Router history={history}>
            <Navbar
              setGuid={() => {}}
              guid={null}
              setUserRoles={() => {}}
              userRoles={null}
            />
          </Router>,
        );
      });
      expect(component.toJSON()).toMatchSnapshot();
    });
  });

  describe('isActive', () => {
    it('should return "active" when window.location.pathname is equal to pathName received', async () => {
      window.location.pathname = '/';
      expect(isActive('/')).toEqual('active');
    });
    it('should return "" when window.location.pathname is not equal to pathName received', async () => {
      global.window = Object.create(window);
      Object.defineProperty(window, 'location', {
        value: {
          pathname: '/admin/manageusers',
        },
      });
      expect(isActive('/')).toEqual('');
    });
  });
});
