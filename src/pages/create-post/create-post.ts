import { Component, HostListener, ElementRef, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';
import { EventPostService } from '../../providers/event-post/event-post';
import { ImageViewerController } from 'ionic-img-viewer';
import { UserPostService } from '../../providers/user-post/user-post';
import { LoadingService } from '../../services/loading-service';
import { ToastService } from '../../services/toast-service';

@IonicPage()
@Component({
  selector: 'create-post-page',
  templateUrl: 'create-post.html',
})
export class CreatePostPage implements OnInit {
  image: string;
  showAlertMessage = true;
  event = {
    name: undefined,
    id: undefined,
  };
  imageStore;
  post;
  textualContent;
  type: string;
  uid = firebase.auth().currentUser.uid;
  @HostListener('document:keydown.enter', ['$event'])
  onKeydownHandler(evt: KeyboardEvent) {
    this.adjust();
  }

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private element: ElementRef,
    private alertCtrl: AlertController,
    private loadingService: LoadingService,
    private db: AngularFireDatabase,
    private eventPostService: EventPostService,
    private imageViewerCtrl: ImageViewerController,
    private userPostService: UserPostService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.post = this.navParams.get('post');
    this.image = this.navParams.get('image');
    this.type = this.navParams.get('type');
    this.event.id = this.navParams.get('eventId');
  }

  ionViewCanLeave() {
    if (this.showAlertMessage) {
      let alertPopup = this.alertCtrl.create({
        title: 'Discard Post?',
        message: "This post won't be saved.",
        buttons: [
          {
            text: 'Discard Post',
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

  private exitPage() {
    this.showAlertMessage = false;
    this.navCtrl.pop();
  }

  ngAfterViewInit() {
    this.adjust();
  }

  adjust(): void {
    let textArea = this.element.nativeElement.getElementsByTagName('textarea')[0];
    textArea.style.overflow = 'hidden';
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + 5 + 'px';
  }

  presentImage(myImage: any) {
    this.imageViewerCtrl.create(myImage).present();
  }

  createEventPost(text: any) {
    this.loadingService.show('Creating post...');
    let imageId = this.db.createPushId();
    this.imageStore = firebase
      .storage()
      .ref('/eventPostsImages')
      .child(`${this.event.id}/${imageId}`);

    if (this.image) {
      this.imageStore.putString(this.image, 'data_url').then(res => {
        this.imageStore.getDownloadURL().then(url => {
          const post = this.getPostObject(text.value, url, imageId);
          this.eventPostService.createEventPost(post, this.event.id, imageId).then(res => {
            this.loadingService.hide();
            this.toastService.presentToast('Successfully created a post!', 'success-toast');
            this.showAlertMessage = false;
            this.navCtrl.pop();
          });
        });
      });
    } else {
      const post = this.getPostObject(text.value);
      this.eventPostService.createEventPost(post, this.event.id, imageId).then(res => {
        this.loadingService.hide();
        this.toastService.presentToast('Successfully created a post!', 'success-toast');
        this.showAlertMessage = false;
        this.navCtrl.pop();
      });
    }
  }

  updateEventPost(text: any) {
    this.loadingService.show('Updating post...');
    if (this.post.imageUrl) {
      const post = this.getPostObject(
        text.value,
        this.post.imageUrl,
        this.post.imageId,
        this.post.timeStamp
      );
      this.eventPostService.updateEventPost(post, this.event.id, this.post.key).then(res => {
        this.loadingService.hide();
        this.toastService.presentToast('Successfully updated a post!', 'success-toast');
        this.showAlertMessage = false;
        this.navCtrl.pop();
      });
    } else {
      const post = this.getPostObject(text.value);
      this.eventPostService.updateEventPost(post, this.event.id, this.post.key).then(res => {
        this.loadingService.hide();
        this.toastService.presentToast('Successfully updated a post!', 'success-toast');
        this.showAlertMessage = false;
        this.navCtrl.pop();
      });
    }
  }

  createUserPost(text: any) {
    this.loadingService.show('Creating post...');
    let imageId = this.db.createPushId();
    this.imageStore = firebase
      .storage()
      .ref('/userPostsImages')
      .child(`${this.uid}/${imageId}`);
    this.imageStore.putString(this.image, 'data_url').then(res => {
      this.imageStore.getDownloadURL().then((url: string) => {
        const post = this.getPostObject(text.value, url, imageId);
        this.userPostService.createUserPost(post, imageId).then(res => {
          this.loadingService.hide();
          this.toastService.presentToast('Successfully created a post!', 'success-toast');
          this.showAlertMessage = false;
          this.navCtrl.pop();
        });
      });
    });
  }

  updateUserPost(text: any) {
    this.loadingService.show('Updating post...');
    const post = this.getPostObject(
      text.value,
      this.post.imageUrl,
      this.post.imageId,
      this.post.timeStamp
    );
    this.userPostService.updateUserPost(post, this.post.key).then(res => {
      this.loadingService.hide();
      this.toastService.presentToast('Successfully updated a post!', 'success-toast');
      this.showAlertMessage = false;
      this.navCtrl.pop();
    });
  }

  getPostObject(text: string, imageUrl?: string, imageId?: string, timeStamp?: string) {
    return {
      textualContent: text,
      imageUrl: imageUrl || null,
      imageId: imageId || null,
      date: '' + new Date(),
      uid: this.uid,
      timeStamp: timeStamp || firebase.database.ServerValue.TIMESTAMP,
    };
  }
}
