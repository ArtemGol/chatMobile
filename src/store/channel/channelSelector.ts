import {StateType} from '../index';
import {createSelector} from '@reduxjs/toolkit';
import {IMessage} from "react-native-gifted-chat";


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


export const allMessagesSelector = createSelector(
    (state: StateType) => state.channel.channelsWithMessages,
    (channelsWithMessages) => {
        const allMessages: IMessage[] = [];
        for (const port in channelsWithMessages) {
            allMessages.push(...channelsWithMessages[port]);
        }
        return allMessages;
    }
);