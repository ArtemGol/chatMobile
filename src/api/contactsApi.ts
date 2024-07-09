import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithReAuth} from './index.ts';

export const contactsApi = createApi({
  reducerPath: 'contactsRequests',
  baseQuery: baseQueryWithReAuth,
  endpoints: builder => ({
    getContactNameByPhone: builder.query<string, string>({
      query: phone => {
        return {
          url: `api/v1/user/phone_exists?phone=${phone}`,
          method: 'get',
        };
      },
    }),
  }),
});

export const {useGetContactNameByPhoneQuery} = contactsApi;
