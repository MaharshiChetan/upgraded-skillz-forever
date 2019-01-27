import { Component, Input } from '@angular/core';
import { App, PopoverController } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { LoadingService } from '../../services/loading-service';
import { PopoverComponent } from '../popover/popover';

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
    private authService: AuthService,
    private loadingService: LoadingService
  ) {}

  goToProfilePage() {
    if (this.authService.currentUserDetails) {
      this.loadingService.show();
      this.app
        .getRootNav()
        .push('ProfilePage', { currentUser: this.authService.currentUserDetails });
    }
  }

  goToNotificationPage() {
    this.navCtrl.push('NotificationsPage');
  }

  presentPopover(event: any) {
    const popoverOptions = [
      { name: 'Leaderboard', id: 1 },
      { name: 'Invite Friends', id: 2 },
      { name: 'Share', id: 3 },
      { name: 'Rate', id: 4 },
      { name: 'Feedback', id: 5 },
      { name: 'Settings', id: 6 },
    ];
    let popover = this.popoverCtrl.create(PopoverComponent, { popoverOptions });
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

  changeOption(event) {}
}
