import { Action } from '@ngrx/store';

export enum ActivityActionTypes {
  LoadActivity = '[Activity] Load Activity',
  UpdateActivity = '[Activity] Update Activity',
  ErrorActivity = '[Activity] Error Activity'
}

export class LoadActivity implements Action {
  readonly type = ActivityActionTypes.LoadActivity;
}

export class UpdateActivity implements Action {
  readonly type = ActivityActionTypes.UpdateActivity;
}

export class ErrorActivity implements Action {
  readonly type = ActivityActionTypes.ErrorActivity;
}

export type ActivityActions = LoadActivity | UpdateActivity | ErrorActivity;
