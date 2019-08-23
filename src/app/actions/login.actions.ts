import { Action } from '@ngrx/store';
import { User } from '../models/user/user';

export enum LoginActionTypes {
  LoadLogin = '[Login] Load Login',
  LoginError = '[Login] Error Login',
  UpdateLogin = '[Login] Update Login'
}

export class LoginAction implements Action {
  type: string;
  payload: {
    user: User,
    error: string
  };
}

export class LoadLogin implements Action {
  readonly type = LoginActionTypes.LoadLogin;

  constructor(readonly payload: {uid: string}) {

  }
}

export class UpdateLogin implements Action {
  readonly type = LoginActionTypes.UpdateLogin;

  constructor(readonly payload: {user: User}) {

  }
}

export class LoginError implements Action {
  readonly type = LoginActionTypes.LoginError;

  constructor(readonly payload: {error: string}) {

  }
}

export type ActionsUnion = LoadLogin | UpdateLogin | LoginError;
