import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateActivityComponent } from './create-activity.component';
import { MaterialModule } from '../../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { RouterTestingModule } from '@angular/router/testing';

describe('CreateActivityComponent', () => {
  let component: CreateActivityComponent;
  let fixture: ComponentFixture<CreateActivityComponent>;

  // stub for the instance of the AngularFireAuth class
  const fireAuthStub = {
    auth: jasmine.createSpyObj('auth', {
      onAuthStateChanged: of('1234')
    }),
    authState: of('1234')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CreateActivityComponent
      ],
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AngularFireAuth, useValue: fireAuthStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
