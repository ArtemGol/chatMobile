import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithReAuth} from './index';
import type {ILoginParams, IRegister, IUserInfo} from './dto/IAuth';

export const authApi = createApi({
  reducerPath: 'authRequests',
  baseQuery: baseQueryWithReAuth,
  endpoints: builder => ({
    login: builder.mutation<{data: unknown}, ILoginParams>({
      query: loginParams => {
        return {
          url: 'api/v1/user/login',
          method: 'post',
          body: loginParams,
        };
      },
    }),
    register: builder.mutation<
      {result: string[]; requestParams: IRegister},
      IRegister
    >({
      query: body => ({
        url: 'api/v1/user/register',
        method: 'post',
        body,
      }),
      transformResponse: (response: string[], meta, arg) => ({
        result: response,
        requestParams: arg,
      }),
    }),
    loginAndFetchUser: builder.mutation<
      {loginResult: string; userInfo: IUserInfo; requestParams: ILoginParams},
      ILoginParams
    >({
      //@ts-ignore
      queryFn: async (loginPayload, _queryApi, _extraOptions, fetchWithBQ) => {
        const loginResponse = await fetchWithBQ({
          url: 'api/v1/user/login',
          method: 'post',
          body: loginPayload,
        });

        if (loginResponse.error) {
          return {error: loginResponse.error};
        }

        // Выполнение запроса на получение данных пользователя после успешного логина
        const userDataResponse = await fetchWithBQ({
          url: 'api/v1/user/me',
          method: 'get',
          headers: {
            Authorization: `${loginResponse.data}`,
          },
        });

        if (userDataResponse.error) {
          return {error: userDataResponse.error};
        }

        return {
          data: {
            loginResult: loginResponse.data,
            userInfo: userDataResponse.data,
            requestParams: loginPayload,
          },
        };
      },
    }),
    updateUser: builder.mutation<IUserInfo, IUserInfo>({
      query: body => ({
        url: 'api/v1/user/me',
        method: 'put',
        body,
      }),
    }),
    updatePassword: builder.mutation<
      IUserInfo,
      {old_password: string; new_password: string; code: string}
    >({
      query: body => ({
        url: 'api/v1/user/me/change_password',
        method: 'post',
        body,
      }),
    }),
  }),
});

export const {useRegisterMutation, useLoginAndFetchUserMutation} = authApi;
