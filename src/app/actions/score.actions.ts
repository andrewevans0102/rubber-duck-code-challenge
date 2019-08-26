import { Action } from '@ngrx/store';

export enum ScoresActionTypes {
  LoadScores = '[Scores] Load Scores',
  UpdateScores = '[Scores] Update Scores',
  ErrorScores = '[Scores] Error Scores'
}

export class LoadScores implements Action {
  readonly type = ScoresActionTypes.LoadScores;
}

export class UpdateScores implements Action {
  readonly type = ScoresActionTypes.UpdateScores;
}

export class ErrorScores implements Action {
  readonly type = ScoresActionTypes.ErrorScores;
}

export type ScoresActions = LoadScores | UpdateScores;
