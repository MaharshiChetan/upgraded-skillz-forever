import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  PopoverController,
  App,
} from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { PopoverComponent } from '../../components/popover/popover';

@IonicPage()
@Component({
  selector: 'home-page',
  templateUrl: 'home.html',
})
export class HomePage {
  userDetails;

  constructor(
    private navCtrl: NavController,
    private authService: AuthProvider,
    private popoverCtrl: PopoverController,
    private app: App
  ) {}

  ionViewWillLoad() {
    this.fetchCurrentUserProfile(null);
  }

  fetchCurrentUserProfile(refresher) {
    this.authService.getUserDetails().then(user => {
      this.userDetails = user;
      console.log(this.userDetails);
      if (refresher) refresher.complete();
    });
  }

  goToProfilePage() {
    this.app
      .getRootNav()
      .push('ProfilePage', { currentUser: this.userDetails });
  }

  presentPopover(ev) {
    let popover = this.popoverCtrl.create(PopoverComponent);

    popover.present({
      ev: ev,
    });

    popover.onDidDismiss(selectedOption => {
      console.log(selectedOption);
      if (selectedOption) {
        if (selectedOption.id === 4) {
          this.navCtrl.push('EditProfilePage', {
            userDetails: this.userDetails,
          });
        }
      }
    });
  }
}
