import {StateType} from '../index';
import {createSelector} from '@reduxjs/toolkit';

const state = ({contacts}: StateType) => contacts;

export const contactsSelector = createSelector(state, ({contacts}) => contacts);
