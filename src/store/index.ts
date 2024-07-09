import {combineReducers} from 'redux';
import {configureStore} from '@reduxjs/toolkit';
import {useDispatch} from 'react-redux';
import {authReducer} from './auth/authSlice.ts';
import {authApi} from '../api/authApi.ts';
import {contactsReducer} from './contacts/contactsSlice.ts';
import {channelApi} from '../api/channelApi.ts';
import {channelReducer} from './channel/channelSlice.ts';
import {contactsApi} from '../api/contactsApi.ts';

const reducer = combineReducers({
  auth: authReducer,
  contacts: contactsReducer,
  channel: channelReducer,
  [authApi.reducerPath]: authApi.reducer,
  [channelApi.reducerPath]: channelApi.reducer,
  [contactsApi.reducerPath]: contactsApi.reducer,
});

export const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(authApi.middleware)
      .concat(channelApi.middleware)
      .concat(contactsApi.middleware),
});

export type StateType = ReturnType<typeof reducer>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
