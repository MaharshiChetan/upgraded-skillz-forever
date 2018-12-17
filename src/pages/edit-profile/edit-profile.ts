import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import firebase from 'firebase';
import {
  IonicPage,
  NavController,
  ActionSheetController,
  Platform,
  LoadingController,
  NavParams,
} from 'ionic-angular';
import { CameraProvider } from '../../providers/camera/camera';
import { AuthProvider } from '../../providers/auth/auth';
import { Message } from '../../providers/message/message';

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
    private loadingCtrl: LoadingController,
    private authService: AuthProvider,
    private presentMessage: Message
  ) {
    this.createForm();
  }

  ionViewWillEnter() {
    this.userProfile = this.navParams.get('userDetails');
  }

  createForm() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      bio: new FormControl('', Validators.required),
    });
  }

  updateUserProfile(name, username, bio, uid) {
    const loader = this.loadingCtrl.create();
    loader.present();
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
              loader.dismissAll();
              this.presentMessage.showToast('Succefully updated your profile!', 'success-toast');
              this.navCtrl.pop();
            })
            .catch(e => {
              loader.dismissAll();
              this.presentMessage.showToast('Failed to updated your profile!', 'fail-toast');
            });
        });
      });
    } else {
      this.authService
        .updateUser(uid, name, username, this.userProfile.profilePhoto, bio, this.userProfile.email)
        .then(res => {
          loader.dismissAll();
          if (this.userProfile.userName !== username) {
            this.authService.removeUsername(this.userProfile.userName);
          }
          this.presentMessage.showToast('Succefully updated your profile!', 'success-toast');
          this.navCtrl.pop();
        })
        .catch(e => {
          loader.dismissAll();
          this.presentMessage.showToast('Failed to updated your profile!', 'fail-toast');
        });
    }
  }
  submitForm() {
    const loader = this.loadingCtrl.create();
    loader.present();
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
            loader.dismissAll();
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
      title: 'upload picture',
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
              parseFloat(this.cameraService.getImageSize(picture)) >
              parseFloat(this.cameraService.getImageSize(data))
                ? data
                : picture;
          });
        }
        loading.dismiss();
      },
      error => {
        alert(error);
      }
    );
  }
}
