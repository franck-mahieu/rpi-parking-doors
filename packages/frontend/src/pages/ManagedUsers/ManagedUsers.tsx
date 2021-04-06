import React, { useCallback, useEffect, useState } from 'react';
import './ManagedUsers.scss';
import AddUserModal from './modals/AddUserModal';
import RemoveUserModal from './modals/RemoveUserModal';
import UpdatePasswordModal from './modals/UpdatePasswordModal';
import { fetchUtils } from '../../shared/utils';

const {
  REACT_APP_USER_MANAGEMENT_TABLE_LOGINS,
  REACT_APP_USER_MANAGEMENT_TABLE_ROLES,
  REACT_APP_USER_MANAGEMENT_TABLE_EMAILS,
  REACT_APP_USER_MANAGEMENT_TABLE_EXPIRATION,
  REACT_APP_USER_MANAGEMENT_TABLE_ACTIONS,
  REACT_APP_TIMEZONE,
} = process.env;

interface IManagedUsers {
  guid: string;
}

const dateOfDays = new Date();
dateOfDays.setHours(0, 0, 0);

export const highLightExpiredUser = (expiration: string) => {
  return dateOfDays > new Date(expiration) ? 'highlight-expired-user' : '';
};

export const ManagedUsers = ({ guid }: IManagedUsers) => {
  const [users, setUsers] = useState<Record<string, unknown>>();

  const getUsers = useCallback(async () => {
    if (guid) {
      const users = await fetchUtils(`/api/users/all?guid=${guid}`, 'GET');
      setUsers(users);
    }
  }, [guid]);

  useEffect(() => {
    if (!users) {
      getUsers();
    }
  }, [users, getUsers]);

  const formatExpirationDate = (user: any) => {
    if (user.expiration) {
      return new Date(user.expiration).toLocaleDateString(REACT_APP_TIMEZONE);
    }
    return '';
  };

  const usersList = (usersParam: any) => {
    if (Array.isArray(usersParam)) {
      return usersParam.map((user: any) => {
        if (user && user.login) {
          return (
            <tr key={user.login}>
              <td>{user.login}</td>
              <td>{user.roles}</td>
              <td>{user.email}</td>
              <td className={highLightExpiredUser(user.expiration)}>
                {formatExpirationDate(user)}
              </td>
              <td>
                <RemoveUserModal
                  login={user.login}
                  guid={guid}
                  getUsers={getUsers}
                />
                <UpdatePasswordModal login={user.login} guid={guid} />
              </td>
            </tr>
          );
        }
      });
    }
  };

  return (
    <div className={'managed-users'}>
      <table className={'centered striped highlight'}>
        <thead>
          <tr>
            <th>{REACT_APP_USER_MANAGEMENT_TABLE_LOGINS}</th>
            <th>{REACT_APP_USER_MANAGEMENT_TABLE_ROLES}</th>
            <th>{REACT_APP_USER_MANAGEMENT_TABLE_EMAILS}</th>
            <th>{REACT_APP_USER_MANAGEMENT_TABLE_EXPIRATION}</th>
            <th>{REACT_APP_USER_MANAGEMENT_TABLE_ACTIONS}</th>
          </tr>
        </thead>
        <tbody>{usersList(users)}</tbody>
      </table>
      <AddUserModal guid={guid} getUsers={getUsers} />
    </div>
  );
};
