import { Test, TestingModule } from '@nestjs/testing';
import { RelaysService } from './relays.service';
import { ConfigModule } from '../common/config/config.module';
import { ConfigService } from '../common/config/config.service';

describe('relay.service', () => {
  let relayService: RelaysService;
  let configService: ConfigService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [RelaysService],
    }).compile();
    relayService = app.get<RelaysService>(RelaysService);
    configService = app.get<ConfigService>(ConfigService);
  });

  describe('activateRelayForSeconds', () => {
    const writeSyncSpy = jest.fn();
    it.each`
      relay                            | expected
      ${null}                          | ${false}
      ${undefined}                     | ${false}
      ${[]}                            | ${false}
      ${[{}]}                          | ${false}
      ${[{ writeSync: writeSyncSpy }]} | ${true}
    `(
      'should return expected $expected when relay is $relay',
      ({ relay, expected }) => {
        jest.useFakeTimers();
        configService.get = jest.fn().mockReturnValue(1);
        relayService.relays = relay;
        const result = relayService.activateRelayForSeconds(0, 0);
        expect(result).toEqual(expected);
        jest.runAllTimers();
        if (expected) {
          return expect(writeSyncSpy).toHaveBeenCalledTimes(2);
        }
      },
    );
  });

  describe('getRelayState', () => {
    const readSyncSpy = jest.fn().mockReturnValue(1);
    it.each`
      relay                          | expected
      ${null}                        | ${false}
      ${undefined}                   | ${false}
      ${[]}                          | ${false}
      ${[{}]}                        | ${false}
      ${[{ readSync: readSyncSpy }]} | ${true}
    `(
      'should return expected $expected when relay is $relay',
      ({ relay, expected }) => {
        configService.get = jest.fn().mockReturnValue(1);
        relayService.relays = relay;
        const result = relayService.getRelayState(0);
        expect(result).toEqual(expected);
      },
    );
  });

  describe('setRelayValue', () => {
    beforeEach(() => {
      configService.get = jest
        .fn()
        .mockReturnValue('20:Porte du rez de chaussée,21:Porte du R+1');
    });

    it('should call GPIO constructor when GPIO is accessible', () => {
      expect(() => relayService.setRelayValue(true)).toThrowError(
        "ENOENT: no such file or directory, open '/sys/class/gpio/export",
      );
    });
    it('should make mock relay when GPIO is not accessible', () => {
      relayService.setRelayValue(false);
      expect(typeof relayService.relays[0].readSync).toEqual('function');
      expect(typeof relayService.relays[0].writeSync).toEqual('function');
    });
    it('should make mock relay when GPIO is not accessible and retrun valid value', () => {
      relayService.setRelayValue(false);
      expect(relayService.relays[0].readSync()).toEqual(0);
      expect(relayService.relays[0].writeSync(1)).toEqual(1);
      expect(relayService.relays[0].readSync()).toEqual(1);
    });
  });
});
