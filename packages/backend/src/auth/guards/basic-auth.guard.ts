import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as auth from 'basic-auth';
import * as bcrypt from 'bcrypt';

import { SqliteService } from '../../common/databases/sqlite/sqlite.service';

export interface IGrantedUsers {
  login: string;
  password: string;
  guid: string;
  roles: Array<string>;
}

@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor(
    private readonly sqliteService: SqliteService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    let credentials: auth.Credentials;
    if (request?.headers?.authorization) {
      credentials = auth(request);
    }

    const userFromDb = await this.sqliteService.findActiveLogin({
      guid: request?.query?.guid,
      login: credentials?.name,
      role: requiredRoles[0],
      expiration: new Date().toISOString(),
    });

    const isValidRequest = await this.checkRequestWithUserFromDb(
      request,
      userFromDb,
      credentials,
    );

    if (isValidRequest) {
      return true;
    } else {
      response.setHeader(
        'WWW-Authenticate',
        'Basic realm="Basic Authentification"',
      );
      throw new UnauthorizedException();
    }
  }

  async checkRequestWithUserFromDb(request, user, credentials) {
    let result = false;
    /* istanbul ignore next */
    if (user?.guid && user?.guid === request?.query?.guid) {
      result = true;
    }

    if (
      user?.password &&
      credentials?.pass &&
      (await bcrypt.compare(credentials.pass, user.password))
    ) {
      result = true;
    }
    return result;
  }
}
