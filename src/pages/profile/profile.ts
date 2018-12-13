import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  LoadingController,
  Platform,
  ActionSheetController,
  NavParams,
  PopoverController,
  App,
  FabContainer,
} from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { CameraProvider } from '../../providers/camera/camera';
import { ImageViewerController } from 'ionic-img-viewer';
import firebase from 'firebase';
import { Message } from '../../providers/message/message';
import { FollowProvider } from '../../providers/follow/follow';

import { PopoverComponent } from '../../components/popover/popover';

@IonicPage()
@Component({
  selector: 'profile-page',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  start = 0;
  fabIcon: any = 'collections';
  dropParentButton = 'post';
  usersdata = firebase.database().ref('/users');
  drop = false;
  userDetails: any;
  chosenPicture: string;
  defaultUserImage = 'assets/default-user.jpeg';
  animate: boolean = true;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean = false;
  followers;
  followings;
  isFollowingSubscription;
  followerSubscription;
  followingSubscription;

  otherUser;
  currentUser;

  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private imageViewerCtrl: ImageViewerController,
    private authService: AuthProvider,
    private loadingCtrl: LoadingController,
    private cameraService: CameraProvider,
    private actionsheetCtrl: ActionSheetController,
    private platform: Platform,
    private presentMessage: Message,
    private followService: FollowProvider,
    private popoverCtrl: PopoverController,
    private app: App
  ) {}

  ionViewDidLeave() {
    this.animate = false;
  }

  ionViewWillEnter() {
    this.otherUser = this.navParams.get('otherUser');
    this.currentUser = this.navParams.get('currentUser');

    if (this.otherUser) {
      this.userDetails = this.otherUser;
      this.checkFollowingAndFollower();
    } else if (this.currentUser) {
      this.userDetails = this.currentUser;
      this.checkFollowingAndFollower();
    } else {
      this.fetchCurrentUserProfile(null);
    }
  }

  ionViewWillLeave() {
    // this.followerSubscription.unsubscribe();
    // this.followingSubscription.unsubscribe();
    // if (this.isFollowingSubscription) {
    //   this.isFollowingSubscription.unsubscribe();
    // }
  }

  checkFollowingAndFollower() {
    this.fetchFollowings();
    this.fetchFollowers();
    this.getFollowing();
  }

  fetchUserProfile(refresher) {
    this.usersdata.child(`${this.userDetails.uid}/personalData`).once('value', snapshot => {
      this.userDetails = snapshot.val();
      console.log(this.userDetails);
      refresher.complete();
    });
    if (refresher) refresher.complete();
  }

  getFollowing() {
    this.isFollowingSubscription = this.followService
      .getFollowing(firebase.auth().currentUser.uid, this.userDetails.uid)
      .subscribe(data => {
        if (data) {
          this.isFollowing = true;
        } else {
          this.isFollowing = false;
        }
      });
  }

  fetchFollowings() {
    this.followingSubscription = this.followService
      .getFollowings(this.userDetails.uid)
      .subscribe(followings => {
        this.followingCount = followings.length;
        this.followings = followings;
      });
  }

  fetchFollowers() {
    this.followerSubscription = this.followService
      .getFollowers(this.userDetails.uid)
      .subscribe(followers => {
        this.followerCount = followers.length;
        this.followers = followers;
      });
  }

  presentImage(myImage) {
    const imageViewer = this.imageViewerCtrl.create(myImage);
    imageViewer.present();
    // imageViewer.onDidDismiss(() => alert('Viewer dismissed'));
  }

  changePicture(fab?: FabContainer) {
    if (fab) fab.close();
    const actionsheet = this.actionsheetCtrl.create({
      title: 'Upload Picture',
      buttons: [
        {
          text: 'Camera',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            this.takePicture();
          },
        },
        {
          text: !this.platform.is('ios') ? 'Gallery' : 'Camera Roll',
          icon: !this.platform.is('ios') ? 'image' : null,
          handler: () => {
            this.getPicture();
          },
        },
        {
          text: 'Cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          role: 'destructive',
          handler: () => {
            console.log('the user has cancelled the interaction.');
          },
        },
      ],
    });
    return actionsheet.present();
  }

  takePicture() {
    const loading = this.loadingCtrl.create();

    loading.present();
    return this.cameraService.getPictureFromCamera(true).then(
      picture => {
        if (picture) {
          const quality = 6 < parseFloat(this.cameraService.getImageSize(picture)) ? 0.5 : 0.8;
          this.cameraService.generateFromImage(picture, quality, data => {
            this.chosenPicture =
              parseFloat(this.cameraService.getImageSize(picture)) >
              parseFloat(this.cameraService.getImageSize(data))
                ? data
                : picture;
            this.navCtrl.push('CreatePostPage', { image: this.chosenPicture });
          });
        }
        loading.dismiss();
      },
      error => {
        alert(error);
      }
    );
  }

  getPicture() {
    const loading = this.loadingCtrl.create();

    loading.present();
    return this.cameraService.getPictureFromPhotoLibrary(true).then(
      picture => {
        if (picture) {
          const quality = 6 < parseFloat(this.cameraService.getImageSize(picture)) ? 0.5 : 0.8;
          this.cameraService.generateFromImage(picture, quality, data => {
            this.chosenPicture =
              this.cameraService.getImageSize(picture) > this.cameraService.getImageSize(data)
                ? data
                : picture;
            this.navCtrl.push('CreatePostPage', { image: this.chosenPicture });
          });
        }
        loading.dismiss();
      },
      error => {
        alert(error);
      }
    );
  }

  fetchCurrentUserProfile(refresher) {
    this.authService.getUserDetails().then(user => {
      this.currentUser = user;
      this.userDetails = user;
      this.fetchFollowings();
      this.fetchFollowers();
      if (refresher) refresher.complete();
    });
  }

  editUserProfile() {
    if (this.userDetails.uid === firebase.auth().currentUser.uid) {
      this.navCtrl.push('EditProfilePage', { userDetails: this.userDetails });
    }
  }

  goToOneToOneChatPage(userDetails) {
    this.navCtrl.push('OneToOneChatPage', { userDetails: userDetails });
  }

  follow() {
    this.followService.follow(firebase.auth().currentUser.uid, this.userDetails.uid);
    this.presentMessage.showToast(
      `You have given a drop to ${this.userDetails.userName}`,
      'success-toast'
    );
  }

  unfollow() {
    this.followService.unfollow(firebase.auth().currentUser.uid, this.userDetails.uid);
    this.presentMessage.showToast(
      `You have taken away a drop from ${this.userDetails.userName}`,
      'success-toast'
    );
  }

  goToFollowerFollowingPage(type) {
    this.navCtrl.push('FollowerFollowingPage', {
      followings: this.followings,
      followers: this.followers,
      type: type,
    });
  }

  presentPopover(ev) {
    let type = '';
    if (this.currentUser) {
      type = 'currentUser';
    } else {
      type = 'otherUser';
    }
    let popover = this.popoverCtrl.create(PopoverComponent, { type: type });
    popover.present({
      ev: ev,
    });

    popover.onDidDismiss(selectedOption => {
      if (selectedOption) {
        if (selectedOption.name === 'Edit Profile') {
          this.editUserProfile();
        } else if (selectedOption.name === 'Settings') {
          this.navCtrl.push('SettingsPage');
        } else if (selectedOption.name === 'My Events') {
          this.navCtrl.push('MyEventsPage');
        } else if (selectedOption.name === 'My Tutorials') {
          this.navCtrl.push('MyTutorialsPage');
        } else if (selectedOption.name === 'Message') {
          this.navCtrl.push('OneToOneChatPage', { userDetails: this.otherUser });
        }
      }
    });
  }

  goToFollowersPage() {
    this.navCtrl.push('FollowerFollowingPage', {
      followers: this.followers,
      followings: this.followings,
      type: 'Dropers',
    });
  }

  goToTitlesFormPage(fab: FabContainer) {
    fab.close();
    this.app.getRootNav().push('TitlesFormPage');
  }

  goToCreateEventPage(fab: FabContainer) {
    fab.close();
    this.app.getRootNav().push('CreateEventPage');
  }

  onTabSelect(event) {
    if (event.index === 2) {
      this.fabIcon = 'titles';
    } else if (event.index === 1) {
      this.fabIcon = 'collections';
    } else {
      this.fabIcon = false;
    }
  }
}
