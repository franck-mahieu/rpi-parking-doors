import { Injectable } from '@nestjs/common';
import * as onoff from 'onoff';

const { Gpio } = onoff;
import { ConfigService } from '../common/config/config.service';

@Injectable()
export class RelaysService {
  relays;
  virtualValue;

  constructor(private readonly config: ConfigService) {
    this.setRelayValue(Gpio.accessible);
  }

  activateRelayForSeconds(relayNumber: number, seconds: number): boolean {
    try {
      this.relays[relayNumber].writeSync(this.config.get('STATE_ON'));
      setTimeout(() => {
        this.relays[relayNumber].writeSync(this.config.get('STATE_OFF'));
      }, seconds * 1000);
      return true;
    } catch (e) {
      return false;
    }
  }

  getRelayState(relayNumber: number): boolean {
    if (
      this.relays &&
      this.relays[relayNumber] &&
      this.relays[relayNumber].readSync &&
      this.relays[relayNumber].readSync() === this.config.get('STATE_ON')
    ) {
      return true;
    }
    return false;
  }

  setRelayValue(gpioAccessible: boolean) {
    const relaysFromConf = this.config.get('RELAYS').split(',');

    /** usefull to launch the project in local (for developpment) */
    if (gpioAccessible) {
      this.relays = relaysFromConf.map(
        relay => new Gpio(parseInt(relay), 'out'),
      );
    } else {
      this.virtualValue = relaysFromConf.map(() => 0);
      this.relays = relaysFromConf.map((relay, index) => ({
        writeSync: value => {
          this.virtualValue[index] = value;
          return value;
        },
        readSync: () => {
          return this.virtualValue[index];
        },
      }));
    }
  }
}
