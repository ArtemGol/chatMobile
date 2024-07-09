import {StateType} from '../index';
import {createSelector} from '@reduxjs/toolkit';

const state = ({channel}: StateType) => channel;

export const channelSelector = createSelector(state, ({channel}) => channel);

export const channelsMessagesSelector = createSelector(
  state,
  ({channelsWithMessages}) => channelsWithMessages,
);

export const connectionSelector = createSelector(
  state,
  ({connection}) => connection,
);

export const newMessagesSelector = createSelector(
  state,
  ({newMessages}) => newMessages,
);

export const currentRoomUserSelector = createSelector(
  state,
  ({currentRoomUser}) => currentRoomUser,
);
