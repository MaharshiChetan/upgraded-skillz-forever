import { Component, Input, OnInit } from '@angular/core';
import { App, PopoverController } from 'ionic-angular';
import { NewPopoverComponent } from '../new-popover/new-popover';
import { AuthProvider } from '../../providers/auth/auth';
import { NavController } from 'ionic-angular/navigation/nav-controller';

@Component({
  selector: 'navbar',
  templateUrl: 'navbar.html',
})
export class NavbarComponent implements OnInit {
  @Input('navbarTitle') navbarTitle: string;

  options = 'all';
  userDetails;
  constructor(
    private app: App,
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private authService: AuthProvider
  ) {}

  ngOnInit() {
    this.fetchCurrentUserProfile();
  }

  fetchCurrentUserProfile(refresher?) {
    this.authService.getUserDetails().then(user => {
      this.userDetails = user;
      if (refresher) refresher.complete();
    });
  }

  goToProfilePage() {
    this.app.getRootNav().push('ProfilePage', { currentUser: this.userDetails });
  }

  goToNotificationPage() {
    this.navCtrl.push('NotificationsPage');
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
