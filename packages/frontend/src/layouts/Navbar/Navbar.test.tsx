import { Navbar } from './Navbar';
import { Router } from 'react-router-dom';
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

    it('should renders correctly when fetchUtils return correct roles and guid', async () => {
      utils.fetchUtils.mockResolvedValue({
        guid: 'guid',
        roles: 'roles',
      });
      await act(async () => {
        const history = createMemoryHistory();
        component = renderer.create(
          <Router history={history}>
            <Navbar setGuid={() => {}} guid={'guid'} />
          </Router>,
        );
      });
      expect(component.toJSON()).toMatchSnapshot();
    });

    it('should renders correctly when fetchUtils return empty guid', async () => {
      utils.fetchUtils.mockResolvedValue({
        guid: undefined,
        roles: 'roles',
      });
      await act(async () => {
        const history = createMemoryHistory();
        component = renderer.create(
          <Router history={history}>
            <Navbar setGuid={() => {}} guid={'guid'} />
          </Router>,
        );
      });
      expect(component.toJSON()).toMatchSnapshot();
    });

    it('should renders correctly when fetchUtils return admin roles guid', async () => {
      utils.fetchUtils.mockResolvedValue({
        guid: undefined,
        roles: 'admin',
      });
      await act(async () => {
        const history = createMemoryHistory();
        component = renderer.create(
          <Router history={history}>
            <Navbar setGuid={() => {}} guid={'guid'} />
          </Router>,
        );
      });
      expect(component.toJSON()).toMatchSnapshot();
    });

    it('should not call fetchUtils when userRoles is already set', async () => {
      React.useState = jest.fn().mockReturnValue(['toto', {}]);
      await act(async () => {
        const history = createMemoryHistory();
        component = renderer.create(
          <Router history={history}>
            <Navbar setGuid={() => {}} guid={'guid'} />
          </Router>,
        );
      });
      expect(utils.fetchUtils).not.toHaveBeenCalled();
    });
  });
});
