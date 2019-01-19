import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import firebase from 'firebase';
import {
  IonicPage,
  NavController,
  ActionSheetController,
  Platform,
  NavParams,
} from 'ionic-angular';
import { CameraProvider } from '../../providers/camera/camera';
import { AuthProvider } from '../../providers/auth/auth';
import { Message } from '../../providers/message/message';
import { LoadingService } from '../../services/loading-service';

@IonicPage()
@Component({
  selector: 'edit-profile-page',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  chosenPicture: any;
  userProfile: any;
  form: FormGroup;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private actionsheetCtrl: ActionSheetController,
    private platform: Platform,
    private cameraService: CameraProvider,
    private loadingService: LoadingService,
    private authService: AuthProvider,
    private presentMessage: Message
  ) {
    this.createForm();
  }

  ionViewWillEnter() {
    this.userProfile = this.navParams.get('userDetails');
    if (!this.userProfile) {
      this.fetchCurrentUserProfile();
    }
  }

  fetchCurrentUserProfile() {
    firebase
      .database()
      .ref(`users/${this.authService.getActiveUser().uid}/personalData`)
      .once('value')
      .then(userData => {
        this.userProfile = userData.val();
      });
  }

  createForm() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      bio: new FormControl('', Validators.required),
    });
  }

  updateUserProfile(name, username, bio, uid) {
    this.loadingService.show('Updating profile...');
    if (this.chosenPicture) {
      const imageStore = firebase
        .storage()
        .ref('/profileimages')
        .child(uid);
      imageStore.putString(this.chosenPicture, 'data_url').then(res => {
        imageStore.getDownloadURL().then(url => {
          this.authService
            .updateUser(uid, name, username, url, bio, this.userProfile.email)
            .then(res => {
              this.loadingService.hide();
              this.presentMessage.showToast('Succefully updated your profile!', 'success-toast');
              this.navCtrl.pop();
            })
            .catch(e => {
              this.loadingService.hide();
              this.presentMessage.showToast('Failed to updated your profile!', 'fail-toast');
            });
        });
      });
    } else {
      this.authService
        .updateUser(uid, name, username, this.userProfile.profilePhoto, bio, this.userProfile.email)
        .then(res => {
          this.loadingService.hide();
          if (this.userProfile.userName !== username) {
            this.authService.removeUsername(this.userProfile.userName);
          }
          this.presentMessage.showToast('Succefully updated your profile!', 'success-toast');
          this.navCtrl.pop();
        })
        .catch(e => {
          this.loadingService.hide();
          this.presentMessage.showToast('Failed to updated your profile!', 'fail-toast');
        });
    }
  }

  submitForm() {
    this.loadingService.show('Updating profile...');
    const name = this.form.get('name').value;
    const username = this.form.get('username').value;
    const bio = this.form.get('bio').value;
    const uid = this.authService.getActiveUser().uid;
    if (this.userProfile.userName !== username) {
      this.authService
        .checkUsername(username)
        .once('value')
        .then(snapshot => {
          if (snapshot.val()) {
            this.loadingService.hide();
            this.presentMessage.showToast(`Username ${username} is already taken!`, 'fail-toast');
            return;
          } else {
            this.updateUserProfile(name, username, bio, uid);
          }
        });
    } else {
      this.updateUserProfile(name, username, bio, uid);
    }
  }

  removeSpaceFromUsername() {
    const username = this.form.get('username').value.trim();
    this.form.get('username').setValue(username);
  }

  changePicture() {
    const actionsheet = this.actionsheetCtrl.create({
      title: 'Upload picture',
      buttons: [
        {
          text: 'Camera',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            this.takePicture();
          },
        },
        {
          text: !this.platform.is('ios') ? 'Gallery' : 'Camera roll',
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
    this.loadingService.show();
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
          });
        }
        this.loadingService.hide();
      },
      error => {
        alert(error);
      }
    );
  }

  getPicture() {
    this.loadingService.show();
    return this.cameraService.getPictureFromPhotoLibrary(true).then(
      picture => {
        if (picture) {
          const quality = 6 < parseFloat(this.cameraService.getImageSize(picture)) ? 0.5 : 0.8;
          this.cameraService.generateFromImage(picture, quality, data => {
            this.chosenPicture =
              parseFloat(this.cameraService.getImageSize(picture)) >
              parseFloat(this.cameraService.getImageSize(data))
                ? data
                : picture;
          });
        }
        this.loadingService.hide();
      },
      error => {
        alert(error);
      }
    );
  }
}
