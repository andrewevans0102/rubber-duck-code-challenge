import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { PopupModalData } from 'src/app/models/popup-modal-data/popup-modal-data';
import { PopupService } from 'src/app/services/popup.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  activityDisplay = [];
  firstName: string;
  lastName: string;
  scores = [];
  admin: boolean;
  showSpinner = false;
  joinSlack = environment.joinSlack;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public popupService: PopupService) { }

  ngOnInit() {
    this.afAuth.auth.onAuthStateChanged(user => {
      if (user) {
        this.selectUser(user.uid);
      } else {
        this.router.navigateByUrl('/home');
      }
    });

    this.selectScores();
  }

  async selectUser(uid: string) {
    await this.afs.collection('users').ref.doc(uid).get()
      .then((documentSnapshot) => {
        this.firstName = documentSnapshot.data().firstName;
        this.lastName = documentSnapshot.data().lastName;
        this.admin = documentSnapshot.data().admin;
      })
      .catch((error) => {
        return this.errorPopup(error.message);
      });
  }

  createActivity() {
    this.router.navigateByUrl('/create-activity');
  }

  viewActivity() {
    this.router.navigateByUrl('/view-activity');
  }

  viewHighScores() {
    this.router.navigateByUrl('/view-scores');
  }

  viewAdmin() {
    this.router.navigateByUrl('/admin');
  }

  async logout() {
    const signOut = await this.afAuth.auth.signOut()
      .catch(() => new Error('Error when signing out'));

    if ( signOut instanceof Error ) {
      return this.errorPopup(signOut.message);
    } else {
      this.router.navigateByUrl('/home');
    }
  }

  async selectScores() {
    this.scores = [];
    await this.afs.collection('users').ref.get()
      .then((querySnapshot) => {
        // select users
        querySnapshot.forEach((doc) => {
          const userScore = {
            place: 0,
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            score: doc.data().score
          };
          this.scores.push(userScore);
        });

        this.scores.sort(this.compare);
        let place = 1;
        let i = 0;
        for (i = 0; i < this.scores.length; i++) {
          this.scores[i].place = place;
          place = place + 1;
        }
      })
      .catch((error) => {
        return this.errorPopup(error.message);
      });
  }

  // wrote custom compare operator to sort score values
  compare( a, b ) {
    // sort descending
    if ( a.score < b.score ) {
      return 1;
    }
    if ( a.score > b.score ) {
      return -1;
    }
    return 0;
  }

  async clearScores() {
    // turn on spinner while updating
    this.showSpinner = true;

    // save off top three scores
    const d = new Date();
    const saveScores = {
      scoreTitle: d.toLocaleDateString() + ' ' + d.toLocaleTimeString(),
      firstPlace: this.scores[0],
      secondPlace: this.scores[1],
      thirdPlace: this.scores[2]
    };
    const idSaved = this.afs.createId();
    await this.afs.collection('highScores').doc(idSaved).set(saveScores)
    .catch((error) => {
      this.showSpinner = false;
      return this.errorPopup(error.message);
    });

    // first place
    const slackMessage = ':tada: Congratulations to our winners! :tada: \n'
      + '(1) :star: *' + this.scores[0].firstName + ' ' + this.scores[0].lastName
      + '* with a score of *' + this.scores[0].score + '*\n'
      + '(2) :birthday: *' + this.scores[1].firstName + ' ' + this.scores[1].lastName
      + '* with a score of *' + this.scores[1].score + '*\n'
      + '(3) :game_die: *' + this.scores[2].firstName + ' ' + this.scores[2].lastName
      + '* with a score of *' + this.scores[2].score + '*\n';
    const firstPlace = {
      message: slackMessage
    };
    try {
      await fetch(environment.highScores, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrer: 'no-referrer',
        body: JSON.stringify(firstPlace)
      });
    } catch (error) {
      this.showSpinner = false;
      return this.errorPopup(error.message);
    }

    // create array of users to be updated with score of 0 here
    const users = [];
    await this.afs.collection('users').ref.get()
      .then((querySnapshot) => {
        // select users
        querySnapshot.forEach((doc) => {
          const userItem = {
            uid: doc.id,
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            score: 0,
            admin: doc.data().admin
          };
          users.push(userItem);
        });
      })
    .catch((error) => {
      this.showSpinner = false;
      return this.errorPopup(error.message);
    });

    // loop through array and make all users score 0 formally
    for (const user of users) {
      await this.afs.collection('users').doc(user.uid).set(user)
      .catch((error) => {
        this.showSpinner = false;
        return this.errorPopup(error.message);
      });
    }

    // select all activities and mark them all cleared
    const activityItems = [];
    await this.afs.collection('teamActivity').ref.get()
      .then((querySnapshot) => {
        // select tasks
        querySnapshot.forEach((doc) => {
          const activityItem = {
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            uid: doc.data().uid,
            activity: doc.data().activity,
            description: doc.data().description,
            link: doc.data().link,
            points: doc.data().points,
            id: doc.data().id,
            cleared: true
          };
          activityItems.push(activityItem);
        });
      })
    .catch((error) => {
      this.showSpinner = false;
      return this.errorPopup(error.message);
    });

    // loop through array and make all update all saved activities
    for (const activity of activityItems) {
      await this.afs.collection('teamActivity').doc(activity.id).set(activity)
      .catch((error) => {
        this.showSpinner = false;
        return this.errorPopup(error.message);
      });
    }

    // select users again for display
    this.selectScores();

    this.showSpinner = false;
    this.infoPopup('scores have been cleared successfully');
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
