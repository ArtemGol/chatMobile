import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithReAuth} from './index.ts';
import type {IChannel} from './dto/IChannel.ts';

export const channelApi = createApi({
  reducerPath: 'channelRequests',
  baseQuery: baseQueryWithReAuth,
  tagTypes: ['Rooms'],
  endpoints: builder => ({
    addChannel: builder.mutation<IChannel, IChannel>({
      query: body => ({
        url: 'api/v1/user_info/',
        method: 'post',
        body,
      }),
      transformResponse: (response: IChannel, meta, arg) => ({
        ip: arg.ip,
        port: arg.port,
      }),
      invalidatesTags: [{type: 'Rooms', id: 'LIST'}],
    }),
    getChannelByNickName: builder.query<IChannel, string>({
      query: username => ({
        url: `api/v1/user_info/?username=${username}`,
        method: 'get',
      }),
    }),
  }),
});

export const {useGetChannelByNickNameQuery} = channelApi;
