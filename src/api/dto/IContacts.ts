import type {IChannel} from './IChannel.ts';

export interface IContact {
  id: string;
  name: string;
  phoneNumbers: string[];
  nickname: string;
  channel: IChannel | null;
}

export interface IContactsState {
  contacts: IContact[];
}
