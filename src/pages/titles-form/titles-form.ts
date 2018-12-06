import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController,
  Platform,
  ActionSheetController,
} from 'ionic-angular';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { TitlesProvider } from '../../providers/titles/titles';
import firebase from 'firebase';
import { Message } from '../../providers/message/message';
import { CameraProvider } from '../../providers/camera/camera';
import { AngularFireDatabase } from 'angularfire2/database';

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
    private loadingCtrl: LoadingController,
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad TitlesFormPage');
  }

  createForm() {
    if (this.type === 'edit') {
      console.log(this.title);

      this.form = new FormGroup({
        title: new FormControl(this.title.title.title.title, Validators.required),
        description: new FormControl(this.title.title.title.description, Validators.required),
        location: new FormControl(this.title.title.title.location, Validators.required),
        winningPosition: new FormControl(
          this.title.title.title.winningPosition,
          Validators.required
        ),
        competitionCategory: new FormControl(
          this.title.title.title.competitionCategory,
          Validators.required
        ),
        type: new FormControl(this.title.title.title.type, Validators.required),
        year: new FormControl(this.title.title.title.year, Validators.required),
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
            console.log(data);
          },
        },
      ],
    });
    prompt.present();
  }

  createTitle() {
    const loader = this.loadingCtrl.create();
    loader.present();
    if (this.chosenPicture) {
      let imageId = this.db.createPushId();
      if (this.title) {
        imageId = this.title.title.title.imageId;
      }
      this.imageStore = firebase
        .storage()
        .ref('/titleImages')
        .child(`${this.uid}/${imageId}`);

      this.imageStore.putString(this.chosenPicture, 'data_url').then(res => {
        this.imageStore.getDownloadURL().then(url => {
          this.updateTitleDetails(url, imageId);
          if (this.type == 'edit') {
            this.updateTitle();
            loader.dismiss();
            this.navCtrl.pop();
          } else {
            this.titlesService.createTitle(firebase.auth().currentUser.uid, this.title);
            loader.dismiss();
            this.navCtrl.pop();
          }
        });
      });
    } else {
      this.updateTitleDetails();
      if (this.type == 'edit') {
        this.updateTitle();
        loader.dismiss();
        this.navCtrl.pop();
      } else {
        this.titlesService.createTitle(firebase.auth().currentUser.uid, this.title);
        loader.dismiss();
        this.navCtrl.pop();
      }
    }
  }

  updateTitleDetails(imageUrl?, imageId?) {
    if (!imageUrl && this.title) {
      imageUrl = this.title.title.title.image;
      imageId = this.title.title.title.imageId;
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
      imageId: imageId,
    };
  }

  updateTitle() {
    this.titlesService.updateTitle(firebase.auth().currentUser.uid, this.titleKey, this.title);
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
