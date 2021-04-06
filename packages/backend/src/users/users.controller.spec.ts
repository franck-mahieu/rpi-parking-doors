import { Test, TestingModule } from '@nestjs/testing';
import { SqliteService } from '../common/databases/sqlite/sqlite.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule } from '../common/config/config.module';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [UsersController],
      providers: [UsersService, SqliteService],
    }).compile();

    usersController = app.get<UsersController>(UsersController);
    usersService = app.get<UsersService>(UsersService);
  });

  describe('getRolesAndGuid', () => {
    it('should call getRolesAndGuid service with valid param when call', async () => {
      jest.spyOn(usersService, 'getRolesAndGuid').mockResolvedValue(undefined);
      const result = await usersController.getRolesAndGuid(
        {
          headers: { authorization: 'Basic YWRtaW46YWRtaW4=' },
        },
        { guid: 'guid' },
      );
      expect(usersService.getRolesAndGuid).toHaveBeenNthCalledWith(
        1,
        {
          headers: { authorization: 'Basic YWRtaW46YWRtaW4=' },
        },
        { guid: 'guid' },
      );
      expect(result).toEqual(undefined);
    });
  });

  describe('getAllUsers', () => {
    it('should call getAllUsers service with valid param when call', async () => {
      jest.spyOn(usersService, 'getAllUsers').mockResolvedValue(['user']);
      const result = await usersController.getAllUsers();
      expect(usersService.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual(['user']);
    });
  });

  describe('removeUser', () => {
    it('should call removeUser service with undefined when body is undefined', async () => {
      jest
        .spyOn(usersService, 'removeUser')
        .mockResolvedValue('removeResponse');
      const result = await usersController.removeUser(undefined);

      expect(usersService.removeUser).toHaveBeenNthCalledWith(1, undefined);
      expect(result).toEqual('removeResponse');
    });

    it('should call removeUser service with login param when body contain login', async () => {
      jest
        .spyOn(usersService, 'removeUser')
        .mockResolvedValue('removeResponse');
      const result = await usersController.removeUser({ login: 'login' });

      expect(usersService.removeUser).toHaveBeenNthCalledWith(1, 'login');
      expect(result).toEqual('removeResponse');
    });
  });

  describe('updateUserPassword', () => {
    it('should call updateUserPassword service with undefined when body is empty', async () => {
      jest
        .spyOn(usersService, 'updateUserPassword')
        .mockResolvedValue('updateResponse');
      const result = await usersController.updateUserPassword(undefined);
      expect(usersService.updateUserPassword).toHaveBeenNthCalledWith(
        1,
        undefined,
        undefined,
      );
      expect(result).toEqual('updateResponse');
    });

    it('should call updateUserPassword service with login and password when body contain it', async () => {
      jest
        .spyOn(usersService, 'updateUserPassword')
        .mockResolvedValue('updateResponse');
      const result = await usersController.updateUserPassword({
        login: 'login',
        password: 'password',
      });
      expect(usersService.updateUserPassword).toHaveBeenNthCalledWith(
        1,
        'login',
        'password',
      );
      expect(result).toEqual('updateResponse');
    });
  });

  describe('addUser', () => {
    it('should call addUser service with undefined when body is empty', async () => {
      jest.spyOn(usersService, 'addUser').mockResolvedValue('addResponse');
      const result = await usersController.addUser(undefined);
      expect(usersService.addUser).toHaveBeenNthCalledWith(1, {
        email: undefined,
        expiration: undefined,
        login: undefined,
        password: undefined,
        roles: undefined,
      });
      expect(result).toEqual('addResponse');
    });

    it('should call addUser service with valid params when body contain it', async () => {
      jest.spyOn(usersService, 'addUser').mockResolvedValue('addResponse');
      const result = await usersController.addUser({
        login: 'login',
        password: 'password',
        roles: 'roles',
        email: 'email',
        expiration: 'expiration',
      });
      expect(usersService.addUser).toHaveBeenNthCalledWith(1, {
        login: 'login',
        password: 'password',
        roles: 'roles',
        email: 'email',
        expiration: 'expiration',
      });
      expect(result).toEqual('addResponse');
    });
  });
});
