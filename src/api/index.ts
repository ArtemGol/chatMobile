import {StateType, store} from '../store';
import {BASE_URL} from '../assets/constants';
import {fetchBaseQuery} from '@reduxjs/toolkit/query';
import {authAction} from '../store/auth/authSlice.ts';
import {authApi} from './authApi.ts';

export const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, {getState}) => {
    const token = (getState() as StateType).auth.authInfo.access_token;

    if (token) {
      headers.set('Authorization', token);
    }

    return headers;
  },
});

export const baseQueryWithReAuth = async (
  args: any,
  api: any,
  extraOptions: any,
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Переавторизация и пересет токена
    const authData = store.getState().auth;
    if (authData?.userInfo) {
      const res = await api.dispatch(
        authApi.endpoints.login.initiate({
          username: authData?.userInfo?.username ?? '',
          password: authData.userInfo.password ?? '',
        }),
      );
      if (res.data) {
        api.dispatch(authAction.setToken(res.data));
      }
    }
  }

  return result;
};
