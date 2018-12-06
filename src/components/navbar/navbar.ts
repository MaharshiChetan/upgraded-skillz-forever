import { Component, Input } from '@angular/core';
import { App, PopoverController } from 'ionic-angular';
import { NewPopoverComponent } from '../new-popover/new-popover';

@Component({
  selector: 'navbar',
  templateUrl: 'navbar.html',
})
export class NavbarComponent {
  @Input('navbarTitle') navbarTitle: string;

  options = 'all';
  constructor(private app: App, private popoverCtrl: PopoverController) {}

  goToProfilePage() {
    this.app.getRootNav().push('ProfilePage');
  }

  goToNotificationPage() {
    this.app.getRootNav().push('NotificationsPage');
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
