import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { PopupService } from 'src/app/services/popup/popup.service';
import { PopupModalData } from 'src/app/models/popup-modal-data/popup-modal-data';
import { DatabaseService } from 'src/app/services/database/database.service';
import { User } from 'src/app/models/user/user';
import { Activity } from 'src/app/models/activity/activity';
import { Observable, Subject } from 'rxjs';
import { AppState, selectUser, selectError } from 'src/app/reducers';
import { takeUntil, catchError } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { UpdateLogin } from 'src/app/actions/login.actions';

@Component({
  selector: 'app-view-activity',
  templateUrl: './view-activity.component.html',
  styleUrls: ['./view-activity.component.scss']
})
export class ViewActivityComponent implements OnInit {

  activitySelected = [];
  user: User;
  user$: Observable<any>;
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

    this.selectActivity();
  }

  async selectActivity() {
    this.activitySelected = [];
    this.activitySelected = await this.db.readActivity();
  }

  async deleteItem(activity: Activity) {
    try {
      // delete the activity
      await this.db.deleteActivity(activity);

      // update score
      this.user.score = this.user.score - activity.points;

      // update value
      await this.db.updateUser(this.user);

      // update the store with a dispatched action
      this.store.dispatch(new UpdateLogin({user: this.user}));

      // select activity again to clear the board, this could be more efficient
      this.selectActivity();

      // show popup that activity was deleted successfully
      this.infoPopup('activity was deleted successfully');
    } catch (error) {
      return this.errorPopup(error.message);
    }
  }

  goBack() {
    this.router.navigateByUrl('/content');
  }

  errorPopup(message: string) {
    const popupModalData = {
      warn: message,
      info: null,
      linkText: null,
      linkHref: null
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
