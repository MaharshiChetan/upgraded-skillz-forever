import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'settings-page',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    public storage: Storage
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
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
