import { async, TestBed } from '@angular/core/testing';
import { DatabaseService } from './database.service';
import { MaterialModule } from '../../material/material.module';

describe('DatabaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ],
      imports: [
        MaterialModule
      ],
      providers: [ ]
    })
    .compileComponents();
  }));

  it('should be created', () => {
    const service: DatabaseService = TestBed.get(DatabaseService);
    expect(service).toBeTruthy();
  });
});
