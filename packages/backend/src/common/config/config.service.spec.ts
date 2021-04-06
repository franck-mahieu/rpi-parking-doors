import { ConfigService } from './config.service';

describe('config.service', () => {
  describe('get', () => {
    let configService;
    beforeEach(() => {
      configService = new ConfigService();
    });

    it("should return .env value when environment variable doesn't exist", () => {
      expect(configService.get('PORT')).toEqual('8888');
    });
    it('should return environement variable if exist', () => {
      process.env.PORT = '9999';
      configService = new ConfigService();
      expect(configService.get('PORT')).toEqual('9999');
    });
    it('should return undefined if env var doesn t exist', () => {
      expect(configService.get('undefinded_env_var')).toBeUndefined();
    });
    it('should return undefined if we try to get undefined value', () => {
      expect(configService.get(undefined)).toBeUndefined();
    });
    it('should return undefined if we try to get null value', () => {
      expect(configService.get(null)).toBeUndefined();
    });
  });
});
