import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { PopupModalData } from 'src/app/models/popup-modal-data/popup-modal-data';
import { PopupService } from 'src/app/services/popup/popup.service';
import { DatabaseService } from 'src/app/services/database/database.service';
import { Activity } from 'src/app/models/activity/activity';
import { User } from 'src/app/models/user/user';
import { Observable, Subject } from 'rxjs';
import { AppState, selectUser, selectError } from 'src/app/reducers';
import { takeUntil, catchError } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { UpdateLogin } from 'src/app/actions/login.actions';

@Component({
  selector: 'app-create-activity',
  templateUrl: './create-activity.component.html',
  styleUrls: ['./create-activity.component.scss']
})
export class CreateActivityComponent implements OnInit, OnDestroy  {

  selectedActivity: string;
  createForm = new FormGroup({
    activity: new FormControl(''),
    description: new FormControl(''),
    link: new FormControl(''),
    points: new FormControl('')
  });
  user$: Observable<any>;
  user: User;
  unsubscribe = new Subject();

  constructor(
    public db: DatabaseService,
    public afAuth: AngularFireAuth,
    public router: Router,
    public popupService: PopupService,
    public store: Store<AppState>) { }

  ngOnInit() {
    this.store.pipe(
      takeUntil(this.unsubscribe),
      catchError((error) => {
        throw error;
      })
    )
    .subscribe(state => this.user = state.login.user);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }


  async createActivity() {
    try {
      // using the firestore library to generate the id values here
      const idSaved = this.db.createId(this.afAuth.auth.currentUser.uid);

      // this could potentially become an enum later
      let aPoints = 0;
      switch (this.createForm.controls.activity.value) {
        case 'Read Article':
          aPoints = 10;
          break;
        case 'Wrote Blog Post':
          aPoints = 50;
          break;
        case 'Listened to Podcast':
          aPoints = 10;
          break;
        case 'Watched Video':
          aPoints = 10;
          break;
        case 'Attended Lecture':
          aPoints = 20;
          break;
        case 'Built Hello World App':
          aPoints = 50;
          break;
        case 'Resolved Production Issue':
          aPoints = 50;
          break;
        case 'Attended Meetup':
          aPoints = 20;
          break;
        default:
          aPoints = 0;
      }

      const activity: Activity = {
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        uid: this.afAuth.auth.currentUser.uid,
        activity: this.createForm.controls.activity.value,
        description: this.createForm.controls.description.value,
        link: this.createForm.controls.link.value,
        points: aPoints,
        id: idSaved,
        cleared: false,
        recorded: Date.now()
      };

      await this.db.createActivity(activity);

      // update the score in the users table
      const userUpdate: User = {
        uid: this.afAuth.auth.currentUser.uid,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        score: this.user.score + aPoints,
        admin: this.user.admin
      };

      // call API to update user information
      await this.db.updateUser(userUpdate);

      // update the store with a dispatched action
      this.store.dispatch(new UpdateLogin({user: userUpdate}));

      this.infoPopup('activity was created successfully');
      this.router.navigateByUrl('/content');
    } catch (error) {
      return this.errorPopup(error.message);
    }
  }

  cancel() {
    this.router.navigateByUrl('/content');
  }

  errorPopup(message: string) {
    const popupModalData = {
      warn: message,
      info: null,
      linkHref: null,
      linkText: null
    };
    return this.popupService.openDialog(popupModalData);
  }

  infoPopup(message: string) {
    const popupModalData: PopupModalData = {
      warn: null,
      info: message,
      linkHref: null,
      linkText: null
    };
    return this.popupService.openDialog(popupModalData);
  }
}
