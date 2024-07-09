import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {IContact, IContactsState} from '../../api/dto/IContacts.ts';

const contactsInitialState: IContactsState = {
  contacts: [],
};

export const {actions: contactsAction, reducer: contactsReducer} = createSlice({
  name: 'contacts',
  initialState: contactsInitialState,
  reducers: {
    setContacts: (state, {payload}: PayloadAction<IContact[]>) => {
      state.contacts = payload;
      AsyncStorage.setItem('@contacts', JSON.stringify(payload));
    },
    clearContacts: state => {
      state.contacts = [];
      AsyncStorage.removeItem('@contacts');
    },
    addContact: (state, {payload}: PayloadAction<IContact>) => {
      state.contacts = [...state.contacts, payload];
      AsyncStorage.setItem('@contacts', JSON.stringify(state.contacts));
    },
    removeContact: (state, {payload}: PayloadAction<string>) => {
      state.contacts = state.contacts.filter(contact => contact.id !== payload);
      AsyncStorage.setItem('@contacts', JSON.stringify(state.contacts));
    },
  },
});
