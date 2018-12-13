import { Component, Input } from '@angular/core';
import { App, PopoverController } from 'ionic-angular';
import { NewPopoverComponent } from '../new-popover/new-popover';
import { AuthProvider } from '../../providers/auth/auth';
import { NavController } from 'ionic-angular/navigation/nav-controller';

@Component({
  selector: 'navbar',
  templateUrl: 'navbar.html',
})
export class NavbarComponent {
  @Input('navbarTitle') navbarTitle: string;

  options = 'all';
  userDetails;
  constructor(
    private app: App,
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private authService: AuthProvider
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
    this.app.getRootNav().push('ProfilePage', { currentUser: this.userDetails });
  }

  goToNotificationPage() {
    this.navCtrl.push(
      'NotificationsPage',
      {},
      {
        animate: true,
        animation: 'ios-transition',
        direction: 'forward',
        duration: 500,
      }
    );
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(NewPopoverComponent);

    popover.present({
      ev: event,
    });

    popover.onDidDismiss(selectedOption => {
      if (selectedOption) {
        if (selectedOption.id === 6) {
          this.app.getRootNav().push('SettingsPage');
        }
      }
    });
  }

  changeOption(event) {
    console.log(event);
  }
}
