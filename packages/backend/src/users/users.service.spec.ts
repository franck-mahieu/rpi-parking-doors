import { Test, TestingModule } from '@nestjs/testing';
import { SqliteService } from '../common/databases/sqlite/sqlite.service';
import { UsersService } from './users.service';
import { ConfigModule } from '../common/config/config.module';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

jest.mock('uuid');

describe('UsersService', () => {
  let usersService: UsersService;
  let sqliteService: any;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [UsersService, SqliteService],
    }).compile();
    usersService = app.get<UsersService>(UsersService);
    sqliteService = app.get<SqliteService>(SqliteService);
  });

  describe('getRolesAndGuid', () => {
    it('should call findRolesAndGuid sqlite service with valid param when call with auth headers', async () => {
      jest
        .spyOn(sqliteService, 'findRolesAndGuid')
        .mockResolvedValue(undefined);
      const result = await usersService.getRolesAndGuid(
        { headers: { authorization: 'Basic YWRtaW46YWRtaW4=' } },
        'guid',
      );
      expect(sqliteService.findRolesAndGuid).toHaveBeenNthCalledWith(1, {
        guid: 'guid',
        login: 'admin',
      });
      expect(result).toEqual(undefined);
    });

    it('should call findRolesAndGuid sqlite service with empty param when call without auth headers and guid', async () => {
      jest
        .spyOn(sqliteService, 'findRolesAndGuid')
        .mockResolvedValue(undefined);
      const result = await usersService.getRolesAndGuid(undefined, undefined);
      expect(sqliteService.findRolesAndGuid).toHaveBeenNthCalledWith(1, {
        guid: undefined,
        login: undefined,
        password: undefined,
      });
      expect(result).toEqual(undefined);
    });
  });

  describe('getAllUsers', () => {
    it('should call getAllUsers sqlite service with valid param when call', async () => {
      jest.spyOn(sqliteService, 'findAllUsers').mockResolvedValue(['user']);
      const result = await usersService.getAllUsers();
      expect(sqliteService.findAllUsers).toHaveBeenCalled();
      expect(result).toEqual(['user']);
    });
  });

  describe('removeUser', () => {
    it('should call removeUser sqlite service with undefined when body is undefined', async () => {
      jest
        .spyOn(sqliteService, 'removeUser')
        .mockResolvedValue('removeResponse');
      const result = await usersService.removeUser(undefined);

      expect(sqliteService.removeUser).toHaveBeenNthCalledWith(1, undefined);
      expect(result).toEqual('removeResponse');
    });
  });

  describe('updateUserPassword', () => {
    it('should call updateUserPassword sqlite service with empty received params', async () => {
      jest
        .spyOn(sqliteService, 'updateUserPassword')
        .mockResolvedValue('updateResponse');
      await expect(
        usersService.updateUserPassword(undefined, undefined),
      ).rejects.toThrowError('data and salt arguments required');
      expect(sqliteService.updateUserPassword).not.toHaveBeenCalled();
    });

    it('should call updateUserPassword sqlite service with login and password when it received', async () => {
      jest
        .spyOn(sqliteService, 'updateUserPassword')
        .mockResolvedValue('updateResponse');
      const result = await usersService.updateUserPassword('login', 'password');
      expect(sqliteService.updateUserPassword).toHaveBeenNthCalledWith(
        1,
        'login',
        expect.any(String),
      );
      expect(
        await bcrypt.compare(
          'password',
          sqliteService.updateUserPassword.mock.calls[0][1],
        ),
      ).toBe(true);
      expect(result).toEqual('updateResponse');
    });
  });

  describe('addUser', () => {
    beforeEach(() => {
      uuidv4.mockImplementationOnce(() => 'guid');
    });

    it('should throw an error when body is empty', async () => {
      jest.spyOn(sqliteService, 'addUser').mockResolvedValue('addResponse');
      await expect(
        usersService.addUser({
          login: undefined,
          password: undefined,
          email: undefined,
          roles: undefined,
          expiration: undefined,
        }),
      ).rejects.toThrowError('data and salt arguments required');
      expect(sqliteService.addUser).not.toHaveBeenCalled();
    });

    it('should call addUser sqlite service with valid params when body contain it', async () => {
      jest.spyOn(sqliteService, 'addUser').mockResolvedValue('addResponse');
      const result = await usersService.addUser({
        login: 'login',
        password: 'password',
        roles: 'roles',
        email: 'email',
        expiration: 'expiration',
      });
      expect(sqliteService.addUser).toHaveBeenNthCalledWith(1, {
        login: 'login',
        password: expect.any(String),
        roles: 'roles',
        email: 'email',
        expiration: 'expiration',
        guid: 'guid',
      });
      expect(
        await bcrypt.compare(
          'password',
          sqliteService.addUser.mock.calls[0][0].password,
        ),
      ).toBe(true);
      expect(result).toEqual('addResponse');
    });
  });
});
