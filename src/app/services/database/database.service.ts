import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user/user';
import { PopupService } from '../popup/popup.service';
import { Activity } from 'src/app/models/activity/activity';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient, public popupService: PopupService) { }

  createUser(user: User) {
    try {
      return fetch(environment.userAPI, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      throw error;
    }
  }

  readUser(uid: string): Observable<any> {
    return this.http.get(environment.userAPI + '/' + uid)
      .pipe(
        catchError(err => {
          return throwError('error when getting user information');
        })
      );
  }

  updateUser(user: User) {
    try {
      return fetch(environment.userAPI + '/' + user.uid, {
        method: 'PUT',
        body: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async readUsers() {
    try {
      const response = await fetch(environment.userAPI);
      return response.json();
    } catch (error) {
      throw error;
    }
  }

  createHighScores(saveScores: any) {
    try {
      return fetch(environment.highScoreAPI, {
        method: 'POST',
        body: JSON.stringify(saveScores),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      throw error;
    }
  }

  createActivity(activity: Activity) {
    try {
      return fetch(environment.activityAPI, {
        method: 'POST',
        body: JSON.stringify(activity),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async readActivity() {
    try {
      const activityResponse = await fetch(environment.activityAPI);
      return activityResponse.json();
    } catch (error) {
      throw error;
    }
  }

  updateActivity(activity: Activity) {
    try {
      return fetch(environment.activityAPI + '/' + activity.id, {
        method: 'PUT',
        body: JSON.stringify(activity),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteActivity(activity: Activity) {
    try {
      return fetch(environment.activityAPI + '/' + activity.id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async readHighScores() {
    try {
      const response = await fetch(environment.highScoreAPI);
      return response.json();
    } catch (error) {
      throw error;
    }
  }

  createId(uid: string) {
    // id here is the datetime in milliseconds + the user's uid
    // there may be a better way to do this, but this should ensure unique records here
    const id = Date.now().toString() + '_' + uid;
    return id;
  }

}
