import React from 'react';
import renderer from 'react-test-renderer';

import * as utils from '../../shared/utils';

jest.mock('../../shared/utils');

import relays from './Relays';

describe('Relays.tsx', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
    //@ts-ignore
    utils.fetchUtils.mockResolvedValue(true);
  });

  describe('Relays', () => {
    it('should render component correctly', () => {
      const component = renderer
        .create(<relays.Relays guid={'guid'} />)
        .toJSON();
      expect(component).toMatchSnapshot();
    });

    it('should call onButtonClick on click on two buttons', () => {
      const component = renderer.create(<relays.Relays guid={'guid'} />);
      jest.spyOn(relays, 'onButtonClick').mockResolvedValue();
      component.root.findByProps({ id: 'relayState0' }).props.onClick();
      component.root.findByProps({ id: 'relayState1' }).props.onClick();
      expect(relays.onButtonClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('getRelayState', () => {
    it('should call fetchUtils and setRelayState with valid params', async () => {
      const setRelayStateMock = jest.fn();
      const result = await relays.getRelayState({
        relayNumber: 0,
        setRelayState: setRelayStateMock,
        guid: 'guid',
      });
      expect(utils.fetchUtils).toHaveBeenCalledWith(
        '/api/relays/state/0?guid=guid',
        'GET',
      );
      expect(setRelayStateMock).toHaveBeenCalledWith(true);
      expect(result).toEqual(true);
    });
  });

  describe('openCloseRelay', () => {
    it('should call fetchUtils with valid params', async () => {
      await relays.openCloseRelay({
        relayNumber: 0,
        guid: 'guid',
      });
      expect(utils.fetchUtils).toHaveBeenCalledWith(
        '/api/relays/openClose/0?guid=guid',
        'POST',
      );
    });
  });

  describe('getRelayStateUntilRelayIsOff', () => {
    it('should call fetchUtils with and setRelayState with valid params', async () => {
      const setRelayStateMock = jest.fn();
      relays.getRelayState = jest
        .fn()
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);
      jest.useFakeTimers();

      await relays.getRelayStateUntilRelayIsOff({
        relayNumber: 0,
        setRelayState: setRelayStateMock,
        guid: 'guid',
      });
      jest.advanceTimersByTime(5000);
      expect(relays.getRelayState).toHaveBeenCalledTimes(2);
    });
  });

  describe('onButtonClick', () => {
    it('should call openCloseRelay, getRelayState, getRelayStateUntilRelayIsOff', async () => {
      const setRelayStateMock = jest.fn();
      jest.spyOn(relays, 'openCloseRelay').mockResolvedValue();
      jest.spyOn(relays, 'getRelayState').mockResolvedValue(true);
      jest.spyOn(relays, 'getRelayStateUntilRelayIsOff').mockReturnValue();
      jest.useFakeTimers();
      await relays.onButtonClick({
        relayNumber: 0,
        setRelayState: setRelayStateMock,
        guid: 'guid',
      });
      jest.advanceTimersByTime(5000);

      expect(relays.openCloseRelay).toHaveBeenCalled();
      expect(relays.getRelayState).toHaveBeenCalled();
      expect(relays.getRelayStateUntilRelayIsOff).toHaveBeenCalled();
    });
  });

  describe('showActiveRelay', () => {
    it('should return enable when relay state is true', async () => {
      const result = await relays.showActiveRelay(true);
      expect(result).toEqual('enable');
    });

    it('should return disable when relay state is false', async () => {
      const result = await relays.showActiveRelay(false);
      expect(result).toEqual('disable');
    });
  });
});
