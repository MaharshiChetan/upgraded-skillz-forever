import { Component, OnInit } from '@angular/core';
import { IonicPage, AlertController, App } from 'ionic-angular';
import { TitlesService } from '../../providers/titles/titles';
import { AuthService } from '../../providers/auth/auth';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'titles-page',
  templateUrl: 'titles.html',
})
export class TitlesPage implements OnInit {
  titles: any;
  chosenPicture: any;
  currentUserId: string = firebase.auth().currentUser.uid;
  uid: string = this.authService.userDetails.uid;
  grayPlaceholder: string = 'assets/gray-placeholder.png';
  constructor(
    private titlesService: TitlesService,
    private alertCtrl: AlertController,
    private app: App,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getTitles();
  }

  getTitles(event?: any) {
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

  goToTitlesFormPage(title: any) {
    this.app.getRootNav().push('TitlesFormPage', { type: 'edit', title: title });
  }

  goToTitleDetailsPage(title: any) {
    this.app.getRootNav().push('TitleDetailsPage', { title: title });
  }
}
