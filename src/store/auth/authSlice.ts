import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {IAuthState, IUserInfo} from '../../api/dto/IAuth';
import {Alert} from 'react-native';
import {authApi} from '../../api/authApi.ts';

export const initialUserInfo: IUserInfo = {
  email: '',
  phone: '',
  username: '',
  password: '',
};

const initialAuthInfo = {
  access_token: '',
};

const authInitialState: IAuthState = {
  userInfo: initialUserInfo,
  authInfo: initialAuthInfo,
  isLoading: true,
  value: 0,
};

const setAsyncTokenAndUserData = async (token: string, userData: string) => {
  await AsyncStorage.setItem('access_token', token);
  await AsyncStorage.setItem('user_data', userData);
};

export const {actions: authAction, reducer: authReducer} = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    setToken: (state, {payload}: PayloadAction<string>) => {
      state.authInfo.access_token = payload;
    },
    logout: state => {
      state.userInfo = initialUserInfo;
      state.authInfo = initialAuthInfo;
      AsyncStorage.removeItem('access_token');
      AsyncStorage.removeItem('user_data');
    },
    setUserData: (
      state,
      {payload}: PayloadAction<{token: string; userData: IUserInfo}>,
    ) => {
      state.authInfo.access_token = payload.token;
      state.userInfo = payload.userData;
    },
  },
  extraReducers: builder =>
    builder
      .addMatcher(
        authApi.endpoints.register.matchFulfilled,
        (state, {payload}) => {
          state.authInfo.access_token = payload.result[0];
          state.userInfo = payload.requestParams;
          setAsyncTokenAndUserData(
            payload.result[0],
            JSON.stringify(payload.requestParams),
          );
        },
      )
      .addMatcher(
        authApi.endpoints.register.matchRejected,
        (state, {payload}) => {
          // @ts-ignore
          const currentError = payload?.data?.detail;
          const data = currentError || 'Some error occurred';
          Alert.alert(data);
        },
      )
      .addMatcher(
        authApi.endpoints?.loginAndFetchUser.matchFulfilled,
        (state, {payload}) => {
          state.authInfo.access_token = payload.loginResult;
          state.userInfo = {
            ...payload.userInfo,
            password: payload.requestParams.password,
          };
          setAsyncTokenAndUserData(
            payload.loginResult,
            JSON.stringify({
              ...payload.userInfo,
              password: payload.requestParams.password,
            }),
          );
        },
      )
      .addMatcher(
        authApi.endpoints?.loginAndFetchUser.matchRejected,
        (state, {payload}) => {
          // @ts-ignore
          const currentError = payload?.data?.detail;
          const data = currentError || 'Password or email are incorrect';
          Alert.alert(data);
        },
      )
      .addMatcher(
        authApi.endpoints?.updateUser.matchFulfilled,
        (state, {payload}) => {
          state.userInfo = {...state.userInfo, ...payload};
          // Alert.alert('User info updated');
        },
      )
      .addMatcher(
        authApi.endpoints.updateUser.matchRejected,
        (state, {payload}) => {
          // @ts-ignore
          const currentError = payload?.data?.detail;
          const data = currentError || 'Some error occurred';
          Alert.alert(data);
        },
      )
      .addMatcher(
        authApi.endpoints?.updatePassword.matchFulfilled,
        (state, {payload}) => {
          console.log('password updated', payload);
        },
      )
      .addMatcher(
        authApi.endpoints.updatePassword.matchRejected,
        (state, {payload}) => {
          // @ts-ignore
          const currentError = payload?.data?.detail;
          console.log('error updatind message', currentError);
          // const data = currentError || 'Some error occurred';
          // Alert.alert(data);
        },
      ),
});
