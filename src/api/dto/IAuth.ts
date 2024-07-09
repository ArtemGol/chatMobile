export interface IAuthInfo {
  access_token: string;
}

export interface IAuthState {
  userInfo: IUserInfo;
  authInfo: IAuthInfo;
  isLoading: boolean;
  value: number;
}

export interface ILoginParams {
  username: string;
  password: string;
}

export interface IRegister extends ILoginParams {
  email: string;
  phone: string;
}

export interface IUserInfo extends IRegister {
  username: string;
}
