import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { PopupModalData } from 'src/app/models/popup-modal-data/popup-modal-data';
import { PopupService } from 'src/app/services/popup/popup.service';
import { environment } from 'src/environments/environment';
import { DatabaseService } from 'src/app/services/database/database.service';
import { User } from 'src/app/models/user/user';
import { Activity } from 'src/app/models/activity/activity';
import { Score } from 'src/app/models/score/score';
import { HighScore } from 'src/app/models/high-score/high-score';

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
    public db: DatabaseService,
    public afAuth: AngularFireAuth,
    public router: Router,
    public popupService: PopupService) { }

  ngOnInit() {
    this.afAuth.auth.onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        this.selectUser(firebaseUser.uid);
      } else {
        this.router.navigateByUrl('/home');
      }
    });

    this.selectScores();
  }

  async selectUser(uid: string) {
    try {
      const response = await this.db.readUser(uid);
      this.firstName = response.firstName;
      this.lastName = response.lastName;
      this.admin = response.admin;
    } catch (error) {
      return this.errorPopup(error.message);
    }
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

    try {
      const users = await this.db.readUsers();
      users.forEach((user) => {
        const userScore: Score = {
          place: 0,
          firstName: user.firstName,
          lastName: user.lastName,
          score: user.score
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
    } catch (error) {
      return this.errorPopup(error.message);
    }
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
    try {
      // turn on spinner while updating
      this.showSpinner = true;

      // retrieve high scores to get value for id here
      const previousScores: any = await this.db.readHighScores();

      // save off top three scores
      const d = new Date();
      const saveScores: HighScore = {
        id: previousScores.length + 1,
        scoreTitle: d.toLocaleDateString() + ' ' + d.toLocaleTimeString(),
        firstPlace: this.scores[0],
        secondPlace: this.scores[1],
        thirdPlace: this.scores[2]
      };

      await this.db.createHighScores(saveScores);

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
      // this could potentially be moved into its own service class eventually
      await fetch(environment.highScoreSlackAPI, {
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

      // set all users score to be 0 here
      const users = await this.db.readUsers();
      users.forEach(async (user) => {
        user.score = 0;

        await this.db.updateUser(user);
      });

      // select all activities and mark them all cleared
      const activityItems = await this.db.readActivity();
      activityItems.forEach(async (activity: Activity) => {
        activity.cleared = true;
        this.db.updateActivity(activity);
      });

      // select users again for display
      this.selectScores();

      this.showSpinner = false;
      this.infoPopup('scores have been cleared successfully');
    } catch (error) {
      this.showSpinner = false;
      return this.errorPopup(error.message);
    }
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
