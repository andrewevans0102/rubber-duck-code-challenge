import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PopupService } from 'src/app/services/popup.service';
import { PopupModalData } from 'src/app/models/popup-modal-data/popup-modal-data';

@Component({
  selector: 'app-view-activity',
  templateUrl: './view-activity.component.html',
  styleUrls: ['./view-activity.component.scss']
})
export class ViewActivityComponent implements OnInit {

  teamActivity: Observable<any[]>;
  user: any;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public popupService: PopupService) { }

  ngOnInit() {
    this.selectActivity();
  }

  selectActivity() {
    this.teamActivity = this.afs.collection('teamActivity').valueChanges();
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
