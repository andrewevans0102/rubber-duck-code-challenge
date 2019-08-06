import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { PopupService } from 'src/app/services/popup/popup.service';
import { environment } from 'src/environments/environment';
import { DatabaseService } from 'src/app/services/database/database.service';
import { PopupModalData } from 'src/app/models/popup-modal-data/popup-modal-data';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  users = [];
  adminForm = new FormGroup({
    admin: new FormControl('')
  });

  constructor(
    public db: DatabaseService,
    public router: Router,
    public popupService: PopupService) { }

  async ngOnInit() {
    this.users = await this.db.readUsers();
  }

  async updateUsers() {
    for (const user of this.users) {
      try {
        await this.db.updateUser(user);
      } catch (error) {
        return this.errorPopup(error.message);
      }
    }
    this.infoPopup('admin users were updated successfully');
  }

  changeAdmin(user) {
    user.admin = !user.admin;
  }

  goBack() {
    this.router.navigateByUrl('/content');
  }

  errorPopup(message: string) {
    const popupModalData: PopupModalData = {
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
