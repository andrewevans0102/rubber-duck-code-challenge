import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PopupService } from 'src/app/services/popup.service';
import { PopupModalData } from 'src/app/models/popup-modal-data/popup-modal-data';
import * as firebase from 'firebase';

@Component({
  selector: 'app-view-activity',
  templateUrl: './view-activity.component.html',
  styleUrls: ['./view-activity.component.scss']
})
export class ViewActivityComponent implements OnInit {

  // teamActivity: Observable<any[]>;
  teamActivity = [];
  user: any;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public popupService: PopupService) { }

  ngOnInit() {
    this.selectActivity();
  }

  async selectActivity() {
    this.teamActivity = [];
    await this.afs.collection('teamActivity').ref.get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const activity = {
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            uid: doc.data().uid,
            activity: doc.data().activity,
            description: doc.data().description,
            link: doc.data().link,
            points: doc.data().points,
            id: doc.data().id,
            cleared: doc.data().cleared,
            recorded: doc.data().recorded
          };
          this.teamActivity.push(activity);
        });
      })
      .catch((error) => {
        return this.errorPopup(error.message);
      });

    // tslint:disable-next-line:only-arrow-functions
    this.teamActivity.sort(function(a, b) {
      const aDate: any = new Date(a.recorded);
      const bDate: any = new Date(b.recorded);
      // https://stackoverflow.com/questions/10123953/sort-javascript-object-array-by-date
      return bDate - aDate;
    });
  }

  // async is not necessary here, but using it to control event loop
  async deleteItem(activity: any) {
    await this.afs.collection('teamActivity').doc(activity.id).delete()
      .catch((error) => {
        return this.errorPopup(error.message);
      });

    // select the user to get their score
    let user = null;
    await this.afs.collection('users').ref.doc(this.afAuth.auth.currentUser.uid).get()
      .then((documentSnapshot) => {
        // score = documentSnapshot.data().score;
        user = documentSnapshot.data();
      })
      .catch((error) => {
        return this.errorPopup(error.message);
      });

    // update score and then save new value
    user.score = user.score - activity.points;
    await this.afs.collection('users').ref.doc(this.afAuth.auth.currentUser.uid).set(user)
      .catch((error) => {
        return this.errorPopup(error.message);
      });

    this.selectActivity();
    this.infoPopup('activity was deleted successfully');
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
