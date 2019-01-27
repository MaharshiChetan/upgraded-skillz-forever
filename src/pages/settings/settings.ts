import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'settings-page',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private storage: Storage
  ) {}

  goToEditProfilePage() {
    this.navCtrl.push('EditProfilePage');
  }

  logout() {
    let alertPopup = this.alertCtrl.create({
      title: 'Log out of Skillz-Forever?',
      message: 'You have to login again, once you have logout.',
      buttons: [
        {
          text: 'Log Out',
          handler: () => {
            alertPopup.dismiss().then(() => {
              this.storage.remove('user');
              this.navCtrl.setRoot('LoginPage');
            });
            return false;
          },
        },
        {
          text: 'Cancel',
          handler: () => {},
        },
      ],
    });
    alertPopup.present();
  }
}
