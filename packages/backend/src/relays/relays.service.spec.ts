import { Test, TestingModule } from '@nestjs/testing';
import { RelaysService } from './relays.service';
import { ConfigModule } from '../common/config/config.module';
import { ConfigService } from '../common/config/config.service';
import * as onoff from 'onoff';

const { Gpio } = onoff;

jest.mock('onoff');

describe('relay.service', () => {
  let relayService: RelaysService;
  let configService: ConfigService;
  jest.resetModules();
  jest.restoreAllMocks();

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [RelaysService],
    }).compile();
    configService = app.get<ConfigService>(ConfigService);
    configService.get = jest.fn().mockReturnValue('0');
    relayService = app.get<RelaysService>(RelaysService);
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
    const readSyncSpy = jest.fn().mockReturnValue(0);
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
        relayService.stateOn = 0;
        relayService.relays = relay;
        const result = relayService.getRelayState(0);
        expect(result).toEqual(expected);
      },
    );
  });

  describe('setRelayValue', () => {
    beforeEach(() => {
      configService.get = jest.fn().mockReturnValue('20,21');
    });

    it('should call GPIO constructor when GPIO is accessible', () => {
      relayService.setRelayValue(true);
      expect(Gpio).toHaveBeenNthCalledWith(1, 20, 'out');
      expect(Gpio).toHaveBeenNthCalledWith(2, 21, 'out');
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

  describe('allRelaysOff', () => {
    const writeSyncSpy = jest.fn();
    const writeSyncSpy2 = jest.fn();
    beforeEach(() => {
      jest.resetAllMocks();
      relayService.relays = [
        { writeSync: writeSyncSpy },
        { writeSync: writeSyncSpy2 },
      ];
    });
    it('should call writeSync with stateOff for all relays', () => {
      relayService.allRelaysOff();
      expect(writeSyncSpy).toHaveBeenCalledWith(1);
      expect(writeSyncSpy2).toHaveBeenCalledWith(1);
    });
    it('should do nothing if relays is empty', () => {
      relayService.relays = undefined;
      relayService.allRelaysOff();
      expect(writeSyncSpy).not.toHaveBeenCalled();
      expect(writeSyncSpy2).not.toHaveBeenCalled();
    });
  });

  describe('allRelaysUnexport', () => {
    const unexportSpy = jest.fn();
    const unexportSpy2 = jest.fn();
    beforeEach(() => {
      jest.resetAllMocks();
      relayService.relays = [
        { unexport: unexportSpy },
        { unexport: unexportSpy2 },
      ];
    });
    it('should call unexport for all relays', () => {
      relayService.allRelaysUnexport();
      expect(unexportSpy).toHaveBeenCalled();
      expect(unexportSpy2).toHaveBeenCalled();
    });
    it('should do nothing if relays is empty', () => {
      relayService.relays = undefined;
      relayService.allRelaysUnexport();
      expect(unexportSpy).not.toHaveBeenCalled();
      expect(unexportSpy2).not.toHaveBeenCalled();
    });
  });

  describe('onApplicationShutdown', () => {
    it('should call allRelaysUnexport with stateOff for all relays', () => {
      const allRelaysUnexportSpy = jest.fn();
      relayService.allRelaysUnexport = allRelaysUnexportSpy;
      relayService.onApplicationShutdown();
      expect(allRelaysUnexportSpy).toHaveBeenCalled();
    });
  });
});
