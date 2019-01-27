import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  ActionSheetController,
  AlertController,
} from 'ionic-angular';
import { CameraService } from '../../providers/camera/camera';
import { EventsService } from '../../providers/events/events';
import firebase from 'firebase';
import { AuthService } from '../../providers/auth/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { LoadingService } from '../../services/loading-service';
import { ToastService } from '../../services/toast-service';

@IonicPage()
@Component({
  selector: 'create-event-page',
  templateUrl: 'create-event.html',
})
export class CreateEventPage implements AfterViewInit {
  eventForm: FormGroup;
  eventData: any;
  imageStore: any;
  button: string = 'Create';
  subscription: any;
  imageChoice = 'Upload Event Image';
  chosenPicture: string;
  defaultPicture: string = '../../assets/black.jpg';
  categories = [];
  event = {
    startTime: '10:00',
    endTime: '19:00',
    startDate: this.currentDate(),
    endDate: this.currentDate(),
    min: new Date().getFullYear(),
    max: new Date().getFullYear() + 1,
  };
  showAlertMessage = true;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private element: ElementRef,
    private cameraService: CameraService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private actionsheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private platform: Platform,
    private eventService: EventsService,
    private authService: AuthService,
    private db: AngularFireDatabase
  ) {
    this.eventData = this.navParams.get('eventData');

    if (this.eventData) {
      this.button = 'Update';
      this.categories = this.eventData.eventCategories || [];
    }

    this.createForm();
    if (this.chosenPicture || this.eventData) this.imageChoice = 'Change Event Image';
  }

  ngAfterViewInit() {
    this.adjust(0);
  }

  ionViewCanLeave() {
    if (this.showAlertMessage) {
      let alertPopup = this.alertCtrl.create({
        title: 'Discard Event?',
        message: !this.eventData
          ? "This event won't be saved."
          : "The changes for event made won't be get saved.",
        buttons: [
          {
            text: 'Discard Event',
            handler: () => {
              alertPopup.dismiss().then(() => {
                this.exitPage();
              });
              return false;
            },
          },
          {
            text: 'Cancel',
            handler: () => {},
          },
        ],
      });
      alertPopup.present();
      return false;
    }
  }

  currentDate() {
    const splitDate = new Date().toLocaleDateString().split('/');
    splitDate[1] = splitDate[1].length == 1 ? '0' + splitDate[1] : splitDate[1];
    splitDate[0] = splitDate[0].length == 1 ? '0' + splitDate[0] : splitDate[0];
    return `${splitDate[2]}-${splitDate[0]}-${splitDate[1]}`;
  }

  createForm() {
    if (this.eventData) {
      this.eventForm = new FormGroup({
        eventName: new FormControl(this.eventData.eventName, Validators.required),
        startDate: new FormControl(this.eventData.startDate, Validators.required),
        endDate: new FormControl(this.eventData.endDate, Validators.required),
        startTime: new FormControl(this.eventData.startTime, Validators.required),
        endTime: new FormControl(this.eventData.endTime, Validators.required),
        eventPrice: new FormControl(this.eventData.eventPrice, Validators.required),
        eventLocation: new FormControl(this.eventData.eventLocation, Validators.required),
        eventState: new FormControl(this.eventData.eventState, Validators.required),
        eventCity: new FormControl(this.eventData.eventCity, Validators.required),
      });
    } else {
      this.eventForm = new FormGroup({
        eventName: new FormControl('', Validators.required),
        startDate: new FormControl(this.event.startDate, Validators.required),
        endDate: new FormControl(this.event.endDate, Validators.required),
        startTime: new FormControl(this.event.startTime, Validators.required),
        endTime: new FormControl(this.event.endTime, Validators.required),
        eventPrice: new FormControl('', Validators.required),
        eventLocation: new FormControl('', Validators.required),
        eventState: new FormControl('', Validators.required),
        eventCity: new FormControl('', Validators.required),
      });
    }
  }

  uploadPicture() {
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
    return this.cameraService.getPictureFromCamera(false).then(
      picture => {
        if (picture) {
          const quality = 6 < parseFloat(this.cameraService.getImageSize(picture)) ? 0.5 : 0.8;
          this.cameraService.generateFromImage(picture, quality, data => {
            this.chosenPicture =
              parseFloat(this.cameraService.getImageSize(picture)) >
              parseFloat(this.cameraService.getImageSize(data))
                ? data
                : picture;
            this.imageChoice = 'Change Event Image';
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
    return this.cameraService.getPictureFromPhotoLibrary(false).then(
      picture => {
        if (picture) {
          const quality = 6 < parseFloat(this.cameraService.getImageSize(picture)) ? 0.5 : 0.8;
          this.cameraService.generateFromImage(picture, quality, data => {
            this.chosenPicture =
              parseFloat(this.cameraService.getImageSize(picture)) >
              parseFloat(this.cameraService.getImageSize(data))
                ? data
                : picture;
            this.imageChoice = 'Change Event Image';
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

  adjust(index): void {
    let textArea = this.element.nativeElement.getElementsByTagName('textarea')[index];
    textArea.style.overflow = 'hidden';
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + 10 + 'px';
  }

  updateForm(description, uid, imageId, imageUrl) {
    const event = {
      eventName: this.eventForm.get('eventName').value,
      eventDescription: description.value,
      eventLocation: this.eventForm.get('eventLocation').value,
      eventState: this.eventForm.get('eventState').value,
      eventCity: this.eventForm.get('eventCity').value,
      eventPrice: this.eventForm.get('eventPrice').value,
      startDate: this.eventForm.get('startDate').value,
      endDate: this.eventForm.get('endDate').value,
      startTime: this.eventForm.get('startTime').value,
      endTime: this.eventForm.get('endTime').value,
      startDateAndTime: `${this.eventForm.get('startDate').value} ${
        this.eventForm.get('startTime').value
      }`,
      endDateAndTime: `${this.eventForm.get('endDate').value} ${
        this.eventForm.get('endTime').value
      }`,
      timeStamp: this.eventData
        ? this.eventData.timeStamp
        : firebase.database.ServerValue.TIMESTAMP,
      imageId: imageId,
      imageUrl: imageUrl,
      uid: uid,
      eventCategories: this.categories,
    };
    return event;
  }

  updateEvent(description) {
    if (!(this.chosenPicture || this.eventData)) {
      this.toastService.presentToast('Please upload event image, Its mandatory!', 'fail-toast');
      return;
    }
    this.loadingService.show('Updating event...');
    const uid = this.authService.getActiveUser().uid;
    let imageId = this.eventData ? this.eventData.imageId : this.db.createPushId();

    this.imageStore = firebase
      .storage()
      .ref('/eventImages')
      .child(`${uid}/${imageId}`);
    if (this.chosenPicture && this.eventData) {
      this.imageStore.putString(this.chosenPicture, 'data_url').then(res => {
        this.imageStore.getDownloadURL().then(url => {
          const event = this.updateForm(description, uid, imageId, url);
          this.eventService
            .updateEvent(event, this.eventData.key)
            .then(res => {
              this.loadingService.hide();
              this.toastService.presentToast('Successfully updated event!', 'success-toast');
              this.showAlertMessage = false;
              this.navCtrl.pop();
            })
            .catch(e => {
              this.loadingService.hide();
              this.toastService.presentToast('Failed to update event!', 'fail-toast');
            });
        });
      });
    } else if (this.eventData) {
      const event = this.updateForm(description, uid, imageId, this.eventData.imageUrl);
      this.eventService
        .updateEvent(event, this.eventData.key)
        .then(res => {
          this.loadingService.hide();
          this.toastService.presentToast('Successfully updated event!', 'success-toast');
          this.showAlertMessage = false;
          this.navCtrl.pop();
        })
        .catch(e => {
          this.loadingService.hide();
          this.toastService.presentToast('Failed to update event!', 'fail-toast');
        });
    } else {
      this.imageStore.putString(this.chosenPicture, 'data_url').then(res => {
        this.imageStore.getDownloadURL().then(url => {
          const event = this.updateForm(description, uid, imageId, url);
          this.eventService.createEvent(event, imageId).then(res => {
            this.loadingService.hide();
            this.toastService.presentToast('Successfully created event!', 'success-toast');
            this.showAlertMessage = false;
            this.navCtrl.pop();
          });
        });
      });
    }
  }

  addCategories() {
    const prompt = this.alertCtrl.create({
      title: 'Add Category',
      message: 'Enter the name and price of category.',
      inputs: [
        {
          name: 'category',
          placeholder: 'Category (Eg: Breaking)',
        },
        {
          name: 'fees',
          placeholder: 'Participation fees (Eg: 200)',
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
          text: 'Add',
          handler: data => {
            this.categories.push({ name: data.category, price: data.fees });
          },
        },
      ],
    });
    prompt.present();
  }

  private exitPage() {
    this.showAlertMessage = false;
    this.navCtrl.pop();
  }

  removeCategory(index) {
    this.categories.splice(index, 1);
  }
}
