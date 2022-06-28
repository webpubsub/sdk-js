import { WebPubSubError } from '../../core/components/endpoint';
import { Cursor } from '../../models/Cursor';
import { State } from '../core/state';
import { Effects } from '../effects';
import { disconnect, Events, reconnectingRetry } from '../events';
import { ReceiveReconnectingState } from './receive_reconnecting';
import { ReceiveStoppedState } from './receive_stopped';

export type ReceiveFailureStateContext = {
  channels: string[];
  groups: string[];
  cursor: Cursor;

  reason: WebPubSubError;
};

export const ReceiveFailureState = new State<ReceiveFailureStateContext, Events, Effects>('RECEIVE_FAILURE');

ReceiveFailureState.on(reconnectingRetry.type, (context) =>
  ReceiveReconnectingState.with({
    ...context,
    attempts: 0, // TODO: figure out what should be the reason
  }),
);

ReceiveFailureState.on(disconnect.type, (context) =>
  ReceiveStoppedState.with({
    channels: context.channels,
    groups: context.groups,
    cursor: context.cursor,
  }),
);
