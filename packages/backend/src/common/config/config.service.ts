import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private readonly envConfig: { [prop: string]: string };

  constructor() {
    const parsedConfig = dotenv.parse(
      fs.readFileSync(__dirname + '/../../../.env'),
    );

    this.envConfig = Object.keys(parsedConfig).reduce((acc, key) => {
      if (process.env.hasOwnProperty(key) && parsedConfig[key]) {
        parsedConfig[key] = process.env[key] as string;
      }
      return parsedConfig;
    }, parsedConfig);
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
