import React from 'react';
import { useHistory, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import './Navbar.scss';
import { fetchUtils } from '../../shared/utils';

const {
  REACT_APP_LABEL_NAVBAR_COMMAND_DOORS,
  REACT_APP_LABEL_NAVBAR_USER_MANAGEMENT,
} = process.env;

interface INavbar {
  setGuid: (guid: string) => void;
  guid: string | null;
  setUserRoles: (guid: string) => void;
  userRoles: string | null;
}

export const isActive = (pathName: string): string => {
  return window.location.pathname === pathName ? 'active' : '';
};

export const shouldShow = (requiredRole: string, userRoles: string | null) => {
  return userRoles?.includes(requiredRole);
};

export const Navbar = ({ setGuid, guid, setUserRoles, userRoles }: INavbar) => {
  const history = useHistory();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const guidInPathParam = params.get('guid');

  React.useEffect(() => {
    if (!userRoles) {
      const fetchRoles = async () => {
        const { roles, guid } = await fetchUtils(
          `/api/users/rolesAndGuid?guid=${guidInPathParam}`,
          'GET',
        );
        setUserRoles(roles?.split(' '));
        if (guid) {
          setGuid(guid);
          history.push({
            pathname: window.location.pathname,
            search: `?guid=${guid}`,
          });
        }
      };
      fetchRoles();
    }
  });

  return (
    <nav>
      <div className="nav-wrapper">
        <span className="brand-logo center">RPI Parking Door</span>

        <a
          className="right"
          href={'https://github.com/franck-mahieu/rpi-parking-doors'}
        >
          <svg
            className="github-logo"
            height="32"
            viewBox="0 0 16 16"
            version="1.1"
            width="32"
            aria-hidden="true"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
        </a>

        <ul className="left">
          <li className={isActive('/')}>
            <Link to={`/?guid=${guid}`} className="nav-link">
              {REACT_APP_LABEL_NAVBAR_COMMAND_DOORS}
            </Link>
          </li>
          {shouldShow('admin', userRoles) && (
            <li className={isActive('/admin/manageusers')}>
              <Link to={`/admin/manageusers?guid=${guid}`} className="nav-link">
                {REACT_APP_LABEL_NAVBAR_USER_MANAGEMENT}
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};
