import { Component } from '@angular/core';
import { IonicPage, NavController, PopoverController, App } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { PopoverComponent } from '../../components/popover/popover';

@IonicPage()
@Component({
  selector: 'home-page',
  templateUrl: 'home.html',
})
export class HomePage {
  userDetails;
  cards = [
    {
      avatarImageUrl: 'assets/img/avatar/marty-avatar.png',
      postImageUrl: 'assets/img/card/advance-card-bttf.png',
      name: 'Marty Mcfly',
      postText:
        'Wait a minute. Wait a minute, Doc. Uhhh... Are you telling me that you built a time machine... out of a DeLorean?! Whoa. This is heavy.',
      date: 'November 5, 1955',
      likes: 12,
      comments: 4,
      timestamp: '11h ago',
    },
    {
      avatarImageUrl: 'assets/img/avatar/sarah-avatar.jpg',
      postImageUrl: 'assets/img/card/advance-card-tmntr.jpg',
      name: 'Sarah Connor',
      postText:
        'I face the unknown future, with a sense of hope. Because if a machine, a Terminator, can learn the value of human life, maybe we can too.',
      date: 'May 12, 1984',
      likes: 30,
      comments: 64,
      timestamp: '30yr ago',
    },
    {
      avatarImageUrl: 'assets/img/avatar/ian-avatar.png',
      postImageUrl: 'assets/img/card/advance-card-jp.jpg',
      name: 'Dr. Ian Malcolm',
      postText:
        "Your scientists were so preoccupied with whether or not they could, that they didn't stop to think if they should.",
      date: 'June 28, 1990',
      likes: 46,
      comments: 66,
      timestamp: '2d ago',
    },
  ];

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
    this.app.getRootNav().push('ProfilePage', { currentUser: this.userDetails });
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
