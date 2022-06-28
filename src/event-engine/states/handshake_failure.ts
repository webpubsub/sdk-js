import { WebPubSubError } from '../../core/components/endpoint';
import { State } from '../core/state';
import { Effects } from '../effects';
import { disconnect, Events, handshakingReconnectingRetry } from '../events';
import { HandshakeReconnectingState } from './handshake_reconnecting';
import { HandshakeStoppedState } from './handshake_stopped';

export type HandshakeFailureStateContext = {
  channels: string[];
  groups: string[];

  reason: WebPubSubError;
};

export const HandshakeFailureState = new State<HandshakeFailureStateContext, Events, Effects>('HANDSHAKE_FAILURE');

HandshakeFailureState.on(handshakingReconnectingRetry.type, (context) =>
  HandshakeReconnectingState.with({
    ...context,
    attempts: 0, // TODO: figure out what should be the reason
  }),
);

HandshakeFailureState.on(disconnect.type, (context) =>
  HandshakeStoppedState.with({
    channels: context.channels,
    groups: context.groups,
  }),
);
