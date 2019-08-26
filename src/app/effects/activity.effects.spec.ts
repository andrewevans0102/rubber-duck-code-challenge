import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { ActivityEffects } from './activity.effects';

describe('ActivityEffects', () => {
  let actions$: Observable<any>;
  let effects: ActivityEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ActivityEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get<ActivityEffects>(ActivityEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
