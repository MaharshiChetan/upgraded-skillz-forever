import { Component } from '@angular/core';
import { IonicPage, AlertController, App } from 'ionic-angular';
import { TitlesProvider } from '../../providers/titles/titles';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'titles-page',
  templateUrl: 'titles.html',
})
export class TitlesPage {
  titles;
  chosenPicture: any;

  constructor(
    private titlesService: TitlesProvider,
    private alertCtrl: AlertController,
    private app: App
  ) {}

  ionViewWillLoad() {
    this.getTitles();
  }

  getTitles(event?) {
    const uid: string = firebase.auth().currentUser.uid;
    this.titlesService.getTitles(uid).subscribe(titles => {
      this.titles = titles;
      console.log(this.titles);
      if (event) event.complete();
    });
  }

  removeTitle(key: string) {
    const uid: string = firebase.auth().currentUser.uid;
    this.titlesService.removeTitle(uid, key);
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

  goToTitlesFormPage(title) {
    this.app.getRootNav().push('TitlesFormPage', { type: 'edit', title: title });
  }
}
