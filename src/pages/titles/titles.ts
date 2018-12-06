import { Component } from '@angular/core';
import { IonicPage, NavParams, AlertController, ToastController, App } from 'ionic-angular';
import { TitlesProvider } from '../../providers/titles/titles';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'titles-page',
  templateUrl: 'titles.html',
})
export class TitlesPage {
  titles;
  uid: string;
  chosenPicture: any;
  view: boolean = false;
  constructor(
    private navParams: NavParams,
    private titlesService: TitlesProvider,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private app: App
  ) {
    this.uid = firebase.auth().currentUser.uid;
  }

  ionViewWillLoad() {
    this.titlesService.getTitles(this.uid).subscribe(titles => {
      this.titles = titles;
    });
  }

  removeTitle(key: string) {
    this.titlesService.removeTitle(this.uid, key);
  }

  showConfirm(key) {
    const confirm = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'The title will gets removed permanently?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          },
        },
        {
          text: 'Agree',
          handler: () => {
            this.removeTitle(key);
          },
        },
      ],
    });
    confirm.present();
  }

  changeView() {
    this.view = !this.view;
  }

  showToast() {
    setTimeout(() => {
      this.toastCtrl
        .create({
          message: 'Slide left for more options',
          position: 'top',
          duration: 3000,
        })
        .present();
    }, 500);
  }

  goToTitlesFormPage(title) {
    this.app.getRootNav().push('TitlesFormPage', { type: 'edit', title: title });
  }
}
