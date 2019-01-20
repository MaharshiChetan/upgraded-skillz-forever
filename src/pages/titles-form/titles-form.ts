import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  Platform,
  ActionSheetController,
} from 'ionic-angular';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { TitlesProvider } from '../../providers/titles/titles';
import firebase from 'firebase';
import { CameraProvider } from '../../providers/camera/camera';
import { AngularFireDatabase } from 'angularfire2/database';
import { LoadingService } from '../../services/loading-service';

@IonicPage()
@Component({
  selector: 'titles-form-page',
  templateUrl: 'titles-form.html',
})
export class TitlesFormPage {
  chosenPicture;
  defaultPicture =
    'https://banner2.kisspng.com/20180406/ype/kisspng-computer-icons-trophy-award-trophy-5ac75f9eef5be5.5335408415230155829804.jpg';
  otherCategory: string = 'Other';
  form: FormGroup;
  title;
  uid = firebase.auth().currentUser.uid;
  type;
  titleKey;
  imageStore;
  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private titlesService: TitlesProvider,
    private actionsheetCtrl: ActionSheetController,
    private cameraService: CameraProvider,
    private platform: Platform,
    private loadingService: LoadingService,
    private navParams: NavParams,
    private db: AngularFireDatabase
  ) {
    this.title = this.navParams.get('title');
    if (this.title) {
      this.titleKey = this.title.key;
    }
    this.type = this.navParams.get('type');
    this.createForm();
  }

  createForm() {
    if (this.type === 'edit') {
      this.form = new FormGroup({
        title: new FormControl(this.title.title.title, Validators.required),
        description: new FormControl(this.title.title.description, Validators.required),
        location: new FormControl(this.title.title.location, Validators.required),
        winningPosition: new FormControl(this.title.title.winningPosition, Validators.required),
        competitionCategory: new FormControl(
          this.title.title.competitionCategory,
          Validators.required
        ),
        type: new FormControl(this.title.title.type, Validators.required),
        year: new FormControl(this.title.title.year, Validators.required),
      });
    } else {
      this.form = new FormGroup({
        title: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
        location: new FormControl('', Validators.required),
        winningPosition: new FormControl('', Validators.required),
        competitionCategory: new FormControl('', Validators.required),
        type: new FormControl('', Validators.required),
        year: new FormControl('', Validators.required),
      });
    }
  }

  change(e) {
    if (e === 'other') {
      this.showPrompt();
    }
  }

  showPrompt() {
    const prompt = this.alertCtrl.create({
      title: 'Category',
      message: 'Please enter the category in which you have won!',
      inputs: [
        {
          name: 'category',
          placeholder: 'Category(other)',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          },
        },
        {
          text: 'Perfect',
          handler: data => {
            this.otherCategory = data.category;
          },
        },
      ],
    });
    prompt.present();
  }

  createTitle() {
    this.loadingService.show('Logging In');
    let imageId = this.db.createPushId();
    if (this.title) {
      imageId = this.title.title.imageId;
    }
    this.imageStore = firebase
      .storage()
      .ref('/titleImages')
      .child(`${this.uid}/${imageId}`);
    if (this.chosenPicture) {
      this.imageStore.putString(this.chosenPicture, 'data_url').then(res => {
        this.imageStore.getDownloadURL().then(url => {
          this.updateTitleDetails(url, imageId);
          if (this.type == 'edit') {
            this.updateTitle();
            this.loadingService.hide();
            this.navCtrl.pop();
          } else {
            this.titlesService.createTitle(this.title, imageId);
            this.loadingService.hide();
            this.navCtrl.pop();
          }
        });
      });
    } else {
      this.updateTitleDetails();
      if (this.type == 'edit') {
        this.updateTitle();
        this.loadingService.hide();
        this.navCtrl.pop();
      } else {
        this.titlesService.createTitle(this.title, imageId);
        this.loadingService.hide();
        this.navCtrl.pop();
      }
    }
  }

  updateTitleDetails(imageUrl?: string, imageId?: string) {
    let updated = null;
    if (!imageUrl && this.title) {
      imageUrl = this.title.title.image;
      updated = '' + new Date();
    }

    this.title = {
      title: this.form.get('title').value,
      description: this.form.get('description').value,
      location: this.form.get('location').value,
      winningPosition: this.form.get('winningPosition').value,
      competitionCategory: this.form.get('competitionCategory').value,
      type: this.form.get('type').value,
      year: this.form.get('year').value,
      image: imageUrl || this.defaultPicture,
      imageId: this.type === 'edit' ? this.title.title.imageId || null : null,
      updated: updated,
      uid: this.uid,
      created: this.type === 'edit' ? this.title.title.created : '' + new Date(),
    };
  }

  updateTitle() {
    this.titlesService.updateTitle(this.titleKey, this.title);
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
        this.loadingService.hide();
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
        this.loadingService.hide();
        alert(error);
      }
    );
  }
}
