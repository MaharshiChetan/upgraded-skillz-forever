import { Component, HostListener, ElementRef } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController,
} from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';
import { PostProvider } from '../../providers/post/post';
import { Message } from '../../providers/message/message';
import { ImageViewerController } from 'ionic-img-viewer';
import { UserPostProvider } from '../../providers/user-post/user-post';

@IonicPage()
@Component({
  selector: 'create-post-page',
  templateUrl: 'create-post.html',
})
export class CreatePostPage {
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
    private loadingCtrl: LoadingController,
    private db: AngularFireDatabase,
    private postService: PostProvider,
    private presentMessage: Message,
    private imageViewerCtrl: ImageViewerController,
    private userPostService: UserPostProvider
  ) {}

  ionViewWillEnter() {
    this.post = this.navParams.get('post');
    this.image = this.navParams.get('image');
    this.type = this.navParams.get('type');
    this.event.name = this.navParams.get('eventName');
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
    const loader = this.loadingCtrl.create();
    loader.present();
    let imageId = this.db.createPushId();
    this.imageStore = firebase
      .storage()
      .ref('/eventPostsImages')
      .child(`${this.event.id}/${imageId}`);

    if (this.image) {
      this.imageStore.putString(this.image, 'data_url').then(res => {
        this.imageStore.getDownloadURL().then(url => {
          const post = this.getPostObject(text.value);
          this.postService.createEventPost(post, imageId, this.event.id).then(res => {
            loader.dismiss();
            this.presentMessage.showToast('Successfully created a post!', 'success-toast');
            this.showAlertMessage = false;
            this.navCtrl.pop();
          });
        });
      });
    } else {
      const post = this.getPostObject(text.value);
      this.postService.createEventPost(post, this.event.id).then(res => {
        loader.dismiss();
        this.presentMessage.showToast('Successfully created a post!', 'success-toast');
        this.showAlertMessage = false;
        this.navCtrl.pop();
      });
    }
  }

  updateEventPost(text: any) {
    const loader = this.loadingCtrl.create();
    loader.present();
    if (this.post.imageUrl) {
      const post = this.getPostObject(text.value, this.post.imageUrl, this.post.imageId);
      this.postService.updateEventPost(post, this.event.id, this.post.key).then(res => {
        loader.dismiss();
        this.presentMessage.showToast('Successfully updated a post!', 'success-toast');
        this.showAlertMessage = false;
        this.navCtrl.pop();
      });
    } else {
      const post = this.getPostObject(text.value, null, null);
      this.postService.updateEventPost(post, this.event.id, this.post.key).then(res => {
        loader.dismiss();
        this.presentMessage.showToast('Successfully updated a post!', 'success-toast');
        this.showAlertMessage = false;
        this.navCtrl.pop();
      });
    }
  }

  createUserPost(text: any) {
    const loader = this.loadingCtrl.create();
    loader.present();
    let imageId = this.db.createPushId();
    this.imageStore = firebase
      .storage()
      .ref('/userPostsImages')
      .child(`${this.uid}/${imageId}`);
    this.imageStore.putString(this.image, 'data_url').then(res => {
      this.imageStore.getDownloadURL().then((url: string) => {
        const post = this.getPostObject(text.value, url, imageId);
        this.userPostService.createUserPost(post, imageId).then(res => {
          loader.dismiss();
          this.presentMessage.showToast('Successfully created a post!', 'success-toast');
          this.showAlertMessage = false;
          this.navCtrl.pop();
        });
      });
    });
  }

  updateUserPost(text: any) {
    const loader = this.loadingCtrl.create();
    loader.present();
    const post = this.getPostObject(
      text.value,
      this.post.imageUrl,
      this.post.imageId,
      this.post.timeStamp
    );
    this.userPostService.updateUserPost(post, this.post.key).then(res => {
      loader.dismiss();
      this.presentMessage.showToast('Successfully updated a post!', 'success-toast');
      this.showAlertMessage = false;
      this.navCtrl.pop();
    });
  }

  getPostObject(text: string, imageUrl?: string, imageId?: string, timeStamp?: any) {
    return {
      textualContent: text,
      imageUrl: imageUrl || '',
      imageId: imageId || '',
      date: '' + new Date(),
      uid: this.uid,
      timeStamp: timeStamp || firebase.database.ServerValue.TIMESTAMP,
    };
  }
}
