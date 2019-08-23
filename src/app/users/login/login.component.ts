import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { PopupService } from 'src/app/services/popup/popup.service';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { LoadLogin } from 'src/app/actions/login.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hidePassword = true;
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('')
  });

  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    public popupService: PopupService,
    private store: Store<AppState>) { }

  ngOnInit() {
  }

  async login() {
    await this.afAuth.auth.signInWithEmailAndPassword(this.loginForm.controls.email.value,
      this.loginForm.controls.password.value)
      .then((response) => {
        this.store.dispatch(new LoadLogin({uid: this.afAuth.auth.currentUser.uid}));
        this.router.navigateByUrl('/content');
      })
      .catch((error) => {
        this.errorPopup(error.message);
        return;
      });
  }

  getEmailErrorMessage() {
    return this.loginForm.controls.email.hasError('required') ? 'You must enter a value' :
        this.loginForm.controls.email.hasError('email') ? 'Not a valid email' :
            '';
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
}
