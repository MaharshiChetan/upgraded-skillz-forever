import { Component } from '@angular/core';
import { IonicPage, AlertController, App } from 'ionic-angular';
import { TitlesProvider } from '../../providers/titles/titles';
import { AuthProvider } from '../../providers/auth/auth';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'titles-page',
  templateUrl: 'titles.html',
})
export class TitlesPage {
  titles: any;
  chosenPicture: any;
  currentUserId: string = firebase.auth().currentUser.uid;
  uid: string = this.authService.userDetails.uid;
  constructor(
    private titlesService: TitlesProvider,
    private alertCtrl: AlertController,
    private app: App,
    private authService: AuthProvider
  ) {}

  ionViewWillEnter() {
    this.getTitles();
  }

  getTitles(event?) {
    this.titlesService.getTitles(this.uid).subscribe(titles => {
      this.titles = titles;
      if (event) event.complete();
    });
  }

  removeTitle(key: string) {
    this.titlesService.removeTitle(key);
  }

  showConfirm(key: string) {
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
