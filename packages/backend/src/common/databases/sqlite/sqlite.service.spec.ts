import { ConfigService } from '../../config/config.service';
import { SqliteService } from './sqlite.service';

describe('SqliteService', () => {
  let sqliteService: SqliteService;
  let prepareMock = jest.fn();
  const getMock = jest.fn();
  const allMock = jest.fn();
  const runMock = jest.fn();
  const closeMock = jest.fn();
  const configService = new ConfigService();

  beforeEach(async () => {
    jest.resetAllMocks();
    sqliteService = new SqliteService(configService);
    prepareMock = jest.fn().mockReturnValue({
      get: getMock,
      all: allMock,
      run: runMock,
    });
    sqliteService.db = {
      prepare: prepareMock,
      close: closeMock,
    };
  });

  describe('findRolesAndGuid', () => {
    it('should call prepare and get with received param and return its result', async () => {
      getMock.mockResolvedValue('findRolesAndGuidResponse');
      const result = await sqliteService.findRolesAndGuid({
        guid: 'guid',
        login: 'login',
      });
      expect(prepareMock).toHaveBeenNthCalledWith(
        1,
        'SELECT roles, guid FROM users WHERE (guid=? OR login=?)',
      );
      expect(getMock).toHaveBeenNthCalledWith(1, 'guid', 'login');
      expect(result).toEqual('findRolesAndGuidResponse');
    });
  });

  describe('findAllUsers', () => {
    it('should call prepare and all and return its result', async () => {
      allMock.mockResolvedValue('findAllUsersResponse');
      const result = await sqliteService.findAllUsers();
      expect(prepareMock).toHaveBeenNthCalledWith(
        1,
        'SELECT login, roles, email, expiration FROM users',
      );
      expect(allMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual('findAllUsersResponse');
    });
  });

  describe('removeUser', () => {
    it('should call prepare and run and return its result', async () => {
      runMock.mockResolvedValue('removeUserResponse');
      const result = await sqliteService.removeUser('login');
      expect(prepareMock).toHaveBeenNthCalledWith(
        1,
        'DELETE from users WHERE login=?',
      );
      expect(runMock).toHaveBeenNthCalledWith(1, 'login');
      expect(result).toEqual('removeUserResponse');
    });
  });

  describe('updateUserPassword', () => {
    it('should call prepare and run and return its result', async () => {
      runMock.mockResolvedValue('updateUserPasswordResponse');
      const result = await sqliteService.updateUserPassword(
        'login',
        'password',
      );
      expect(prepareMock).toHaveBeenNthCalledWith(
        1,
        'UPDATE users SET password=? WHERE login=?',
      );
      expect(runMock).toHaveBeenNthCalledWith(1, 'password', 'login');
      expect(result).toEqual('updateUserPasswordResponse');
    });
  });

  describe('addUser', () => {
    it('should call prepare and run and return its result', async () => {
      runMock.mockResolvedValue('addUserResponse');
      const result = await sqliteService.addUser({
        login: 'login',
        password: 'password',
        email: 'email',
        roles: 'roles',
        guid: 'guid',
        expiration: '2021-02-10T16:17:48.482Z',
      });
      expect(prepareMock).toHaveBeenNthCalledWith(
        1,
        'INSERT INTO users (login, password, email, roles, guid, expiration)VALUES (?,?,?,?,?,date(?))',
      );
      expect(runMock).toHaveBeenNthCalledWith(
        1,
        'login',
        'password',
        'email',
        'roles',
        'guid',
        '2021-02-10T16:17:48.482Z',
      );
      expect(result).toEqual('addUserResponse');
    });
  });

  describe('findActiveLogin', () => {
    it('should call prepare and get and return its result', async () => {
      getMock.mockResolvedValue('addUserResponse');
      const result = await sqliteService.findActiveLogin({
        guid: 'guid',
        login: 'login',
        role: 'roles',
        expiration: '2021-02-10T16:17:48.482Z',
      });
      expect(prepareMock).toHaveBeenNthCalledWith(
        1,
        'SELECT login, password, guid FROM users WHERE (((guid=? OR login=?) AND (expiration>=date(?) OR expiration IS NULL)) AND roles LIKE ?)',
      );
      expect(getMock).toHaveBeenNthCalledWith(
        1,
        'guid',
        'login',
        '2021-02-10T16:17:48.482Z',
        '%roles%',
      );
      expect(result).toEqual('addUserResponse');
    });
  });

  describe('onApplicationShutdown', () => {
    it('should call close when db exist', async () => {
      sqliteService.onApplicationShutdown();
      expect(closeMock).toHaveBeenCalledTimes(1);
    });

    it('should not call close when db not exist', async () => {
      delete sqliteService.db;
      sqliteService.onApplicationShutdown();
      expect(closeMock).not.toHaveBeenCalled();
    });
  });
});
