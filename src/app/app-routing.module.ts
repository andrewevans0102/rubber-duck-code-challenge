import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterUserComponent } from './users/register-user/register-user.component';
import { LoginComponent } from './users/login/login.component';
import { HomeComponent } from './static/home/home.component';
import { ContentComponent } from './static/content/content.component';
import { CreateActivityComponent } from './activity/create-activity/create-activity.component';
import { ViewActivityComponent } from './activity/view-activity/view-activity.component';
import { HighScoresComponent } from './static/high-scores/high-scores.component';
import { AdminComponent } from './users/admin/admin.component';
import { PageNotFoundComponent } from './static/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'register-user', component: RegisterUserComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'content', component: ContentComponent },
  { path: 'create-activity', component: CreateActivityComponent },
  { path: 'view-activity', component: ViewActivityComponent },
  { path: 'view-scores', component: HighScoresComponent },
  { path: 'admin', component: AdminComponent },
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
