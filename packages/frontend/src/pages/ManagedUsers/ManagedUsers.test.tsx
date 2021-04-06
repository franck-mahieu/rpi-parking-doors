import React from 'react';
import renderer, { act } from 'react-test-renderer';

require('jest-specific-snapshot');
const path = require('path');

jest.mock('../../shared/utils');
const utils = require('../../shared/utils');

import { ManagedUsers, highLightExpiredUser } from './ManagedUsers';

describe('ManagedUsers.tsx', () => {
  describe('ManagedUsers', () => {
    let component: any;
    beforeEach(async () => {
      jest.resetModules();
      jest.resetAllMocks();
    });

    it('should renders correctly when fetchUtils return correct user', async () => {
      utils.fetchUtils.mockResolvedValue([
        {
          login: 'login',
          roles: 'roles',
          email: 'email',
          expiration: '2021-03-05',
        },
      ]);
      await act(async () => {
        component = renderer.create(<ManagedUsers guid={'guid'} />);
      });
      expect(component.toJSON()).toMatchSnapshot();
    });

    it('should not call fetchUtils when guid is undefined', () => {
      utils.fetchUtils.mockResolvedValue([
        {
          login: 'login',
          roles: 'roles',
          email: 'email',
          expiration: '2021-03-05',
        },
      ]);
      act(() => {
        // @ts-ignore
        renderer.create(<ManagedUsers guid={undefined} />);
      });
      expect(utils.fetchUtils).not.toHaveBeenCalled();
    });

    it('should renders correctly when fetchUtils return an empty array object', async () => {
      utils.fetchUtils.mockResolvedValue([{}]);
      await act(async () => {
        component = renderer.create(<ManagedUsers guid={'guid'} />);
      });
      const pathToSnap = path.resolve(
        process.cwd(),
        './src/pages/ManagedUsers/__snapshots__/ManagedUsers.test.tsx.empty-user.shot',
      );
      // @ts-ignore
      expect(component.toJSON()).toMatchSpecificSnapshot(pathToSnap);
    });

    it('should renders correctly when fetchUtils return a valid user without expiration', async () => {
      utils.fetchUtils.mockResolvedValue([
        {
          login: 'login',
          roles: 'roles',
          email: 'email',
        },
      ]);
      await act(async () => {
        component = renderer.create(<ManagedUsers guid={'guid'} />);
      });
      const pathToSnap = path.resolve(
        process.cwd(),
        './src/pages/ManagedUsers/__snapshots__/ManagedUsers.test.tsx.undefined-expiration.shot',
      );
      // @ts-ignore
      expect(component.toJSON()).toMatchSpecificSnapshot(pathToSnap);
    });
  });

  describe('highLightExpiredUser', () => {
    it('should return highlight-expired-user when expiration param is not expired', () => {
      expect(highLightExpiredUser(new Date(2020, 1, 1).toISOString())).toEqual(
        'highlight-expired-user',
      );
    });
    it('should return an empty string when expiration param is expired', () => {
      expect(highLightExpiredUser(new Date(2200, 1, 1).toISOString())).toEqual(
        '',
      );
    });
  });
});
