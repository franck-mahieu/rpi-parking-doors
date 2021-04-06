import React, { Dispatch, SetStateAction } from 'react';
import './Relays.scss';
import { fetchUtils } from '../../shared/utils';

const {
  REACT_APP_LABEL_OPEN_BUTTON_1,
  REACT_APP_LABEL_OPEN_BUTTON_2,
  REACT_APP_TITLE_RELAY_PAGE,
} = process.env;

interface IRelays {
  guid: string;
}

interface IRelayStateParams {
  relayNumber: number;
  setRelayState: Dispatch<SetStateAction<boolean>>;
  guid: string;
}

const getRelayState = async ({
  relayNumber,
  setRelayState,
  guid,
}: IRelayStateParams) => {
  const relayState = await fetchUtils(
    `/api/relays/state/${relayNumber}?guid=${guid}`,
    'GET',
  );
  setRelayState(relayState);
  return relayState;
};

const openCloseRelay = async ({
  relayNumber,
  guid,
}: {
  relayNumber: number;
  guid: string;
}) => {
  await fetchUtils(`/api/relays/openClose/${relayNumber}?guid=${guid}`, 'POST');
};

const getRelayStateUntilRelayIsOff = ({
  relayNumber,
  setRelayState,
  guid,
}: IRelayStateParams) => {
  const getRelayStateInterval = setInterval(async () => {
    const relayState = await exportFunctions.getRelayState({
      relayNumber,
      setRelayState,
      guid,
    });
    if (relayState === false) {
      clearInterval(getRelayStateInterval);
    }
  }, 2000);
};

const onButtonClick = async ({
  relayNumber,
  setRelayState,
  guid,
}: IRelayStateParams) => {
  await exportFunctions.openCloseRelay({ relayNumber, guid });
  await exportFunctions.getRelayState({ relayNumber, setRelayState, guid });
  exportFunctions.getRelayStateUntilRelayIsOff({
    relayNumber,
    setRelayState,
    guid,
  });
};

const showActiveRelay = (relayState: boolean) =>
  relayState ? 'enable' : 'disable';

const Relays = ({ guid }: IRelays) => {
  const [relayState0, setRelayState0] = React.useState(false);
  const [relayState1, setRelayState1] = React.useState(false);
  return (
    <div className={'relays'}>
      <h4>{REACT_APP_TITLE_RELAY_PAGE}</h4>
      <button
        id={'relayState0'}
        className={`waves-effect waves-light btn btn-large ${exportFunctions.showActiveRelay(
          relayState0,
        )}`}
        onClick={() =>
          exportFunctions.onButtonClick({
            relayNumber: 0,
            setRelayState: setRelayState0,
            guid,
          })
        }
      >
        {REACT_APP_LABEL_OPEN_BUTTON_1}
      </button>
      <br />
      <button
        id={'relayState1'}
        className={`waves-effect waves-light btn btn-large ${exportFunctions.showActiveRelay(
          relayState1,
        )} `}
        onClick={() =>
          exportFunctions.onButtonClick({
            relayNumber: 1,
            setRelayState: setRelayState1,
            guid,
          })
        }
      >
        {REACT_APP_LABEL_OPEN_BUTTON_2}
      </button>
    </div>
  );
};

const exportFunctions = {
  getRelayState,
  openCloseRelay,
  getRelayStateUntilRelayIsOff,
  onButtonClick,
  showActiveRelay,
  Relays,
};

export default exportFunctions;
