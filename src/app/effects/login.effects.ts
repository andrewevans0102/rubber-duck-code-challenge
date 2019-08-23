import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { DatabaseService } from '../services/database/database.service';
import { AppState } from '../reducers';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
// import { fromFetch } from 'rxjs/fetch';
import { from } from 'rxjs/index';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { LoadLogin, LoginActionTypes, LoginAction, LoginError, UpdateLogin } from '../actions/login.actions';
import { User } from '../models/user/user';


@Injectable()
export class LoginEffects {

  @Effect()
  loadLogin$ = this.actions$
    .pipe(
      ofType<LoadLogin>(LoginActionTypes.LoadLogin),
      mergeMap((action) =>
        from(this.databaseService.readUser(action.payload.uid))
        .pipe(
          map(user => {
            return new UpdateLogin({user});
          }),
          catchError((errorMessage) => of(new LoginError({error: errorMessage})))
        )
      )
  );

  constructor(private actions$: Actions, private store: Store<AppState>, private databaseService: DatabaseService) { }

}
