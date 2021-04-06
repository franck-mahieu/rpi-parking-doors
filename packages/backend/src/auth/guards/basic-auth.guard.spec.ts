import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigModule } from '../../common/config/config.module';
import { SqliteService } from '../../common/databases/sqlite/sqlite.service';
import { BasicAuthGuard } from './basic-auth.guard';

const generatebB64BasicAuth = (login, password) => {
  return 'Basic ' + Buffer.from(login + ':' + password).toString('base64');
};

const findActiveLoginMock = {
  login: 'user',
  password: '$2b$10$D56BSxwn.iAG5PuKG3.QpeG21SWX4u4RB3yUZEtOD.geNYLT1wXK.',
  guid: 'guid',
};

describe('basic-auth.guard', () => {
  let basicAuthGuard: BasicAuthGuard;
  let sqliteService: SqliteService;
  let setHeaderMock;
  let contextMock;
  let reflector;

  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(Date.parse('2021-02-09T11:01:58.135Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [SqliteService, BasicAuthGuard, Reflector],
    }).compile();
    basicAuthGuard = app.get<BasicAuthGuard>(BasicAuthGuard);
    sqliteService = app.get<SqliteService>(SqliteService);
    reflector = app.get<Reflector>(Reflector);
    setHeaderMock = jest.fn();
    jest.spyOn(reflector, 'get').mockReturnValue(['user']);
  });

  describe('canActivate', () => {
    it('should call sqliteService.findActiveLogin with valid params and return true when received login password and findActiveLogin return a user', async () => {
      contextMock = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: {
              authorization: generatebB64BasicAuth('login', 'password'),
            },
            query: {},
          }),
          getResponse: jest.fn().mockReturnValue({ setHeader: setHeaderMock }),
        }),
      };
      jest
        .spyOn(sqliteService, 'findActiveLogin')
        .mockResolvedValue(findActiveLoginMock);
      const result = await basicAuthGuard.canActivate(contextMock);
      expect(sqliteService.findActiveLogin).toHaveBeenCalledWith({
        expiration: '2021-02-09T11:01:58.135Z',
        guid: undefined,
        login: 'login',
        role: 'user',
      });
      expect(result).toEqual(true);
    });

    it('should call sqliteService.findActiveLogin with valid params and return true when received guid and findActiveLogin return a user', async () => {
      contextMock = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: {},
            query: { guid: 'guid' },
          }),
          getResponse: jest.fn().mockReturnValue({ setHeader: setHeaderMock }),
        }),
      };
      jest
        .spyOn(sqliteService, 'findActiveLogin')
        .mockResolvedValue(findActiveLoginMock);
      const result = await basicAuthGuard.canActivate(contextMock);
      expect(sqliteService.findActiveLogin).toHaveBeenCalledWith({
        expiration: '2021-02-09T11:01:58.135Z',
        guid: 'guid',
        login: undefined,
        role: 'user',
      });
      expect(result).toEqual(true);
    });

    it('should throw an error when received login, password, guid but findActiveLogin don t return a user', async () => {
      contextMock = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: {
              authorization: generatebB64BasicAuth('login', 'password'),
            },
            query: { guid: 'guid' },
          }),
          getResponse: jest.fn().mockReturnValue({ setHeader: setHeaderMock }),
        }),
      };
      jest.spyOn(sqliteService, 'findActiveLogin').mockResolvedValue(undefined);

      await expect(
        basicAuthGuard.canActivate(contextMock),
      ).rejects.toThrowError('Unauthorized');

      expect(sqliteService.findActiveLogin).toHaveBeenCalledWith({
        expiration: '2021-02-09T11:01:58.135Z',
        guid: 'guid',
        login: 'login',
        role: 'user',
      });
      expect(setHeaderMock).toHaveBeenNthCalledWith(
        1,
        'WWW-Authenticate',
        'Basic realm="Basic Authentification"',
      );
    });

    it('should throw an error when received empty login, password, guid and when findActiveLogin don t return a user', async () => {
      contextMock = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(undefined),
          getResponse: jest.fn().mockReturnValue({ setHeader: setHeaderMock }),
        }),
      };
      jest.spyOn(sqliteService, 'findActiveLogin').mockResolvedValue(undefined);

      await expect(
        basicAuthGuard.canActivate(contextMock),
      ).rejects.toThrowError('Unauthorized');

      expect(sqliteService.findActiveLogin).toHaveBeenCalledWith({
        expiration: '2021-02-09T11:01:58.135Z',
        guid: undefined,
        login: undefined,
        password: undefined,
        role: 'user',
      });
      expect(setHeaderMock).toHaveBeenNthCalledWith(
        1,
        'WWW-Authenticate',
        'Basic realm="Basic Authentification"',
      );
    });
  });

  describe('checkRequestWithUserFromDb', () => {
    it.each`
      expected | request                         | user                                                                            | credentials
      ${true}  | ${{ query: { guid: 'guid' } }}  | ${{ guid: 'guid' }}                                                             | ${{}}
      ${false} | ${{ query: { guid: 'guid2' } }} | ${{ guid: 'guid' }}                                                             | ${{}}
      ${true}  | ${{}}                           | ${{ password: '$2b$10$EiLulv30lsdRjpmoNUIIcuk6UuOG2TN8zi5e8FO3ecWutcyjts5Pa' }} | ${{ pass: 'admin' }}
      ${false} | ${{}}                           | ${{ password: 'invalid' }}                                                      | ${{ pass: 'admin' }}
      ${false} | ${{}}                           | ${null}                                                                         | ${null}
    `(
      'should return $expected when received request $request, user $user and credentials $credentials',
      async ({ expected, request, user, credentials }) => {
        const result = await basicAuthGuard.checkRequestWithUserFromDb(
          request,
          user,
          credentials,
        );
        expect(result).toBe(expected);
      },
    );
  });
});
