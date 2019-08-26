import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { ScoreEffects } from './score.effects';

describe('ScoreEffects', () => {
  let actions$: Observable<any>;
  let effects: ScoreEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ScoreEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get<ScoreEffects>(ScoreEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
