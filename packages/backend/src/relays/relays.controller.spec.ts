import { Test, TestingModule } from '@nestjs/testing';
import { RelaysController } from './relays.controller';
import { RelaysService } from './relays.service';
import { ConfigModule } from '../common/config/config.module';

describe('relay.controller', () => {
  let relaysController: RelaysController;
  let relayService: RelaysService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [RelaysController],
      providers: [RelaysService],
    }).compile();

    relaysController = app.get<RelaysController>(RelaysController);
    relayService = app.get<RelaysService>(RelaysService);
  });

  describe('getRelayState', () => {
    it.each`
      getRelayStateServiceResult | relayNumber
      ${null}                    | ${0}
      ${undefined}               | ${1}
      ${true}                    | ${0}
      ${false}                   | ${1}
    `(
      'should call getRelayState service with relayNumber $relayNumber and return its result $getRelayStateServiceResult',
      ({ getRelayStateServiceResult, relayNumber }) => {
        jest
          .spyOn(relayService, 'getRelayState')
          .mockReturnValue(getRelayStateServiceResult);
        const result = relaysController.getRelayState(relayNumber);
        expect(relayService.getRelayState).toHaveBeenNthCalledWith(
          1,
          relayNumber,
        );
        expect(result).toBe(getRelayStateServiceResult);
      },
    );
  });

  describe('activateRelayForSeconds', () => {
    it.each`
      activateRelayForSecondsResult | seconds | relayNumber
      ${null}                       | ${10}   | ${0}
      ${undefined}                  | ${10}   | ${1}
      ${true}                       | ${10}   | ${0}
      ${false}                      | ${10}   | ${1}
    `(
      'should call activateRelayForSeconds service with relayNumber $relayNumber and seconds $seconds, and return its result $activateRelayForSecondsResult',
      ({ activateRelayForSecondsResult, seconds, relayNumber }) => {
        jest
          .spyOn(relayService, 'activateRelayForSeconds')
          .mockReturnValue(activateRelayForSecondsResult);
        const result = relaysController.activateRelayForSeconds(relayNumber);
        expect(relayService.activateRelayForSeconds).toHaveBeenNthCalledWith(
          1,
          relayNumber,
          seconds,
        );
        expect(result).toBe(activateRelayForSecondsResult);
      },
    );
  });
});
