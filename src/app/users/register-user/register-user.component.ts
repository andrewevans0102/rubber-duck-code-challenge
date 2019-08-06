import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { PopupService } from 'src/app/services/popup/popup.service';
import { PopupModalData } from 'src/app/models/popup-modal-data/popup-modal-data';
import { DatabaseService } from 'src/app/services/database/database.service';
import { User } from 'src/app/models/user/user';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {

  hidePassword = true;
  createForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl('')
  });
  popupModalData: PopupModalData;

  constructor(
    public db: DatabaseService,
    public afAuth: AngularFireAuth,
    public router: Router,
    public popupService: PopupService) { }

  ngOnInit() {
  }

  getEmailErrorMessage() {
    return this.createForm.controls.email.hasError('required') ? 'You must enter a value' :
        this.createForm.controls.email.hasError('email') ? 'Not a valid email' :
            '';
  }

  async createUser() {
    // create user with authentication service
    // on success this will also sign in this user to the current session
    await this.afAuth.auth.createUserWithEmailAndPassword(this.createForm.controls.email.value,
      this.createForm.controls.password.value)
      .then(() => {
          // save the user and the names to the users table for reference
          // since the user is already signed in its ok to us the currentUser uid value here
          const user: User = {
            uid: this.afAuth.auth.currentUser.uid,
            firstName: this.createForm.controls.firstName.value,
            lastName: this.createForm.controls.lastName.value,
            score: 0,
            admin: false
          };
          this.addUserToUsersTable(user);
      })
      .catch((error => {
        return this.errorPopup(error.message);
      }));
  }

  async addUserToUsersTable(user: User) {
    // save the user and the names to the users table for reference
    // since the user is already signed in its ok to us the currentUser uid value here
    try {
      await this.db.createUser(user);

      const message = 'user was successfully created, you will now be logged in';
      const linkHref = environment.joinSlack;
      const linkText = 'click here to join the slack channel';
      this.createPopup(message, linkHref, linkText);
      this.router.navigateByUrl('/content');
    } catch (error) {
      this.errorPopup(error.message);
      return this.router.navigateByUrl('/home');
    }
  }

  login() {
    this.afAuth.auth.signInWithEmailAndPassword(this.createForm.controls.email.value,
      this.createForm.controls.password.value)
      .then(() => {
        this.router.navigateByUrl('/home');
      })
      .catch((error => {
        return this.errorPopup(error.message);
      }));
  }

  cancel() {
    this.router.navigateByUrl('/home');
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

  createPopup(message: string, createHref: string, text: string) {
    const popupModalData: PopupModalData = {
      warn: null,
      info: message,
      linkHref: createHref,
      linkText: text
    };
    return this.popupService.openDialog(popupModalData);
  }

}
