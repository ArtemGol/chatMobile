import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {channelApi} from '../../api/channelApi.ts';
import type {IChannel} from '../../api/dto/IChannel.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {IMessage} from 'react-native-gifted-chat';
import {Socket} from 'socket.io-client';

interface IInitialState {
  connection?: any;
  channel?: IChannel;
  deviceToken?: string;
  channelsWithMessages: Record<string, IMessage[]>;
  newMessages: Record<string, number>;
  currentRoomUser: string;
}

const channelInitialState: IInitialState = {
  deviceToken: undefined,
  channel: undefined,
  channelsWithMessages: {},
  newMessages: {},
  connection: undefined,
  currentRoomUser: '',
};

export const {actions: channelAction, reducer: channelReducer} = createSlice({
  name: 'channel',
  initialState: channelInitialState,
  reducers: {
    setDeviceToken: (state, {payload}: PayloadAction<string>) => {
      state.deviceToken = payload;
    },
    setCurrentRoomUser: (state, {payload}: PayloadAction<string>) => {
      state.currentRoomUser = payload;
    },
    setNewMessages: (state, {payload}: PayloadAction<string>) => {
      if (state.currentRoomUser !== payload) {
        state.newMessages[payload] = (state.newMessages[payload] || 0) + 1;
      }
    },
    clearNewMessages: state => {
      state.newMessages = {};
    },
    clearNewMessagesByName: (state, {payload}: PayloadAction<string>) => {
      state.newMessages[payload] = 0;
    },
    setRoomsAndChannelsWithMessages: (
      state,
      {
        payload,
      }: PayloadAction<{
        rooms: Record<string, string>;
        channelsWithMessages: Record<string, IMessage[]>;
      }>,
    ) => {
      state.channelsWithMessages = payload.channelsWithMessages;
    },
    setConnection: (state, {payload}: PayloadAction<Socket<any>>) => {
      state.connection = payload;
    },
    setChannel: (state, {payload}: PayloadAction<IChannel>) => {
      state.channel = payload;
    },
    setChannelsWithMessages: (
      state,
      {
        payload,
      }: PayloadAction<{port: string; message: IMessage; roomID: string}>,
    ) => {
      if (
        state.channelsWithMessages[payload.port]?.some(
          el => el._id === payload.message._id,
        )
      ) {
        state.channelsWithMessages[payload.port] = state.channelsWithMessages[
          payload.port
        ].map(el =>
          el._id === payload.message._id ? {...el, sent: true} : el,
        );
      } else {
        if (
          !(
            state.channelsWithMessages?.[payload.port]?.[0]?.text?.includes(
              'has joined the chat',
            ) &&
            state.channelsWithMessages?.[payload.port]?.[0]?.text ===
              payload.message.text
          ) &&
          !!payload.message.text
        ) {
          if (state.channelsWithMessages[payload.port]) {
            state.channelsWithMessages[payload.port] = [
              payload.message,
              ...state.channelsWithMessages[payload.port],
            ];
          } else {
            state.channelsWithMessages[payload.port] = [payload.message];
          }
          AsyncStorage.setItem(
            'channelsWithMessages',
            JSON.stringify(state.channelsWithMessages),
          );
        }
      }
    },
    clearChannelsWithMessages: state => {
      state.channelsWithMessages = {};
    },
  },
  extraReducers: builder =>
    builder.addMatcher(
      channelApi.endpoints.addChannel.matchFulfilled,
      (state, {payload}) => {
        state.channel = payload;
        AsyncStorage.setItem('channel', JSON.stringify(payload));
      },
    ),
});
