import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import { User } from '../models/user/user';
import { LoadLogin, LoginActionTypes, LoginAction } from '../actions/login.actions';

export interface LoginState {
  user: User | null;
  error: string | null;
}

const initialLoginState: LoginState = {
  user: null,
  error: null
};

export interface AppState {
  login: LoginState
}

export function loginReducer(state: LoginState = initialLoginState, action: LoginAction): LoginState {
  switch (action.type) {
    case LoginActionTypes.LoadLogin:
      return {
        user: action.payload.user,
        error: null
      };

    case LoginActionTypes.LoginError:
      return {
        user: null,
        error: action.payload.error
      };

    case LoginActionTypes.UpdateLogin:
      return {
        user: action.payload.user,
        error: null
      };

    default:
      return state;
  }
}

export const reducers: ActionReducerMap<AppState> = {
  login: loginReducer
};

// export const selectLogin = (state: AppState) => state.login;

// export const selectUsername = createSelector(
//   selectLogin,
//   (state: User) => state.firstName
// );

export const selectUser = (state: AppState) => state.login.user;

export const selectError = (state: AppState) => state.login.error;

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
