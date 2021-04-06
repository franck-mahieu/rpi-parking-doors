import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import * as sqlite from 'better-sqlite3';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class SqliteService implements OnApplicationShutdown {
  db: any;

  constructor(private readonly config: ConfigService) {
    (async () => {
      this.db = sqlite(config.get('SQLITE_DATABASE_PATH'));
    })();
  }

  async findRolesAndGuid({ guid, login }): Promise<any> {
    return this.db
      .prepare('SELECT roles, guid FROM users WHERE (guid=? OR login=?)')
      .get(guid, login);
  }

  async findAllUsers(): Promise<any> {
    return this.db
      .prepare('SELECT login, roles, email, expiration FROM users')
      .all();
  }

  async removeUser(login: string): Promise<any> {
    return this.db.prepare('DELETE from users WHERE login=?').run(login);
  }

  async updateUserPassword(login: string, password: string): Promise<any> {
    return this.db
      .prepare('UPDATE users SET password=? WHERE login=?')
      .run(password, login);
  }

  async addUser({
    login,
    password,
    email,
    roles,
    guid,
    expiration,
  }): Promise<any> {
    return this.db
      .prepare(
        'INSERT INTO users (login, password, email, roles, guid, expiration)VALUES (?,?,?,?,?,date(?))',
      )
      .run(login, password, email, roles, guid, expiration);
  }

  async findActiveLogin({ guid, login, role, expiration }): Promise<any> {
    return this.db
      .prepare(
        'SELECT login, password, guid FROM users WHERE (((guid=? OR login=?) AND (expiration>=date(?) OR expiration IS NULL)) AND roles LIKE ?)',
      )
      .get(guid, login, expiration, `%${role}%`);
  }

  onApplicationShutdown() {
    console.info('sqlite database will be gracefully close');
    if (this.db) {
      this.db.close();
    }
  }
}
