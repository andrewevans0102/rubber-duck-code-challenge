import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { PopupService } from 'src/app/services/popup/popup.service';
import { PopupModalData } from 'src/app/models/popup-modal-data/popup-modal-data';
import { DatabaseService } from 'src/app/services/database/database.service';
import { User } from 'src/app/models/user/user';

@Component({
  selector: 'app-view-activity',
  templateUrl: './view-activity.component.html',
  styleUrls: ['./view-activity.component.scss']
})
export class ViewActivityComponent implements OnInit {

  activity = [];
  user: User;

  constructor(
    public db: DatabaseService,
    public afAuth: AngularFireAuth,
    public router: Router,
    public popupService: PopupService) { }

  ngOnInit() {
    this.selectActivity();
    this.selectUser(this.afAuth.auth.currentUser.uid);
  }

  async selectUser(uid: string) {
    this.user = await this.db.readUser(uid);
  }

  async selectActivity() {
    this.activity = await this.db.readActivity();
    this.activity.sort((a, b) => {
      const aDate: any = new Date(a.recorded);
      const bDate: any = new Date(b.recorded);
      // https://stackoverflow.com/questions/10123953/sort-javascript-object-array-by-date
      return bDate - aDate;
    });
  }

  async deleteItem(activity: any) {
    try {
      // delete the activity
      await this.db.deleteActivity(activity.id);

      // update score
      this.user.score = this.user.score - activity.points;

      // update value
      await this.db.updateUser(this.user);

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
