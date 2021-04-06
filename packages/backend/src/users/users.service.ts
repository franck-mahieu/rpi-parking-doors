import { Injectable } from '@nestjs/common';
import * as auth from 'basic-auth';
import { SqliteService } from '../common/databases/sqlite/sqlite.service';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

export interface IRolesAndGuid {
  roles: Array<string>;
  guid: string;
}

@Injectable()
export class UsersService {
  saltRounds = 10;
  relays;
  virtualValue;

  constructor(private readonly sqliteService: SqliteService) {}

  async getRolesAndGuid(request, guid): Promise<IRolesAndGuid> {
    let credentials: auth.Credentials;
    if (request?.headers?.authorization) {
      credentials = auth(request);
    }
    return await this.sqliteService.findRolesAndGuid({
      guid,
      login: credentials?.name,
    });
  }

  async getAllUsers(): Promise<Array<string>> {
    return await this.sqliteService.findAllUsers();
  }

  async removeUser(login): Promise<string> {
    return await this.sqliteService.removeUser(login);
  }

  async updateUserPassword(login, password): Promise<string> {
    const hashPassword = await bcrypt.hash(password, this.saltRounds);
    return await this.sqliteService.updateUserPassword(login, hashPassword);
  }

  async addUser({
    login,
    password,
    email,
    roles,
    expiration,
  }): Promise<string> {
    const hashPassword = await bcrypt.hash(password, this.saltRounds);
    return await this.sqliteService.addUser({
      login,
      password: hashPassword,
      email,
      roles,
      guid: uuidv4(),
      expiration,
    });
  }
}
