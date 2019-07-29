import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateActivityComponent } from './activity/create-activity/create-activity.component';
import { ViewActivityComponent } from './activity/view-activity/view-activity.component';
import { ContentComponent } from './static/content/content.component';
import { HighScoresComponent } from './static/high-scores/high-scores.component';
import { HomeComponent } from './static/home/home.component';
import { PageNotFoundComponent } from './static/page-not-found/page-not-found.component';
import { AdminComponent } from './users/admin/admin.component';
import { RegisterUserComponent } from './users/register-user/register-user.component';
import { LoginComponent } from './users/login/login.component';
import { MaterialModule } from './material/material.module';
import { PopupModalComponent } from './static/popup-modal/popup-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    CreateActivityComponent,
    ViewActivityComponent,
    ContentComponent,
    HighScoresComponent,
    HomeComponent,
    PageNotFoundComponent,
    AdminComponent,
    RegisterUserComponent,
    LoginComponent,
    PopupModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [],
  entryComponents: [ PopupModalComponent ],
  bootstrap: [AppComponent]
})
export class AppModule { }
