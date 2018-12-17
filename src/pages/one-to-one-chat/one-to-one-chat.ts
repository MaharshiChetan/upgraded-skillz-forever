import { Component, ViewChild, Renderer } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Content,
  AlertController,
  ActionSheetController,
  LoadingController,
  Platform,
} from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { AuthProvider } from '../../providers/auth/auth';
import firebase from 'firebase';
import { Keyboard } from '@ionic-native/keyboard';
import { Clipboard } from '@ionic-native/clipboard';
import { Message } from '../../providers/message/message';
import { CameraProvider } from '../../providers/camera/camera';
import { AngularFireDatabase } from 'angularfire2/database';
import { ImageViewerController } from 'ionic-img-viewer';

@IonicPage()
@Component({
  selector: 'one-to-one-chat-page',
  templateUrl: 'one-to-one-chat.html',
})
export class OneToOneChatPage {
  @ViewChild(Content) content: Content;

  inputElement;
  millis = 200;
  scrollTimeout = this.millis + 50;
  textareaHeight;
  scrollContentElement: any;
  footerElement: any;
  initialTextAreaHeight;
  user;
  keyboardHideSub;
  keybaordShowSub;

  otherUserDetails: any;
  messages: any;
  chosenPicture: any;
  currentUserDetails;
  chatSubscription: any;
  message: string = '';
  usersdata = firebase.database().ref('/users');
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private chatService: ChatProvider,
    private authService: AuthProvider,
    private alertCtrl: AlertController,
    private clipboard: Clipboard,
    private presentMessage: Message,
    private actionSheetCtrl: ActionSheetController,
    private cameraService: CameraProvider,
    private loadingCtrl: LoadingController,
    private keyboard: Keyboard,
    private platform: Platform,
    private renderer: Renderer,
    private imageViewerCtrl: ImageViewerController,
    private db: AngularFireDatabase
  ) {}

  ionViewWillEnter() {
    this.otherUserDetails = this.navParams.get('userDetails');

    if (this.otherUserDetails.key) {
      this.otherUserDetails.uid = this.otherUserDetails.key;
    }
    this.authService.getUserDetails().then(userDetails => {
      this.currentUserDetails = userDetails;
      this.fetchMessages();
    });
  }

  ionViewDidLoad() {
    if (this.platform.is('ios')) {
      this.addKeyboardListeners();
    }

    this.scrollContentElement = this.content.getScrollElement();
    this.footerElement = document
      .getElementsByTagName('one-to-one-chat-page')[0]
      .getElementsByTagName('ion-footer')[0];
    this.inputElement = document
      .getElementsByTagName('one-to-one-chat-page')[0]
      .getElementsByTagName('textarea')[0];

    this.footerElement.style.cssText =
      this.footerElement.style.cssText +
      'transition: all ' +
      this.millis +
      'ms; -webkit-transition: all ' +
      this.millis +
      'ms; -webkit-transition-timing-function: ease-out; transition-timing-function: ease-out;';

    this.scrollContentElement.style.cssText =
      this.scrollContentElement.style.cssText +
      'transition: all ' +
      this.millis +
      'ms; -webkit-transition: all ' +
      this.millis +
      'ms; -webkit-transition-timing-function: ease-out; transition-timing-function: ease-out;';

    this.textareaHeight = Number(this.inputElement.style.height.replace('px', ''));
    this.initialTextAreaHeight = this.textareaHeight;

    this.updateScroll('load', 500);
  }
  ionViewCanLeave() {
    this.chatSubscription.unsubscribe();
    this.inputElement.blur();
    if (this.platform.is('ios')) {
      this.removeKeyboardListeners();
    }
  }

  addKeyboardListeners() {
    this.keyboardHideSub = this.keyboard.onKeyboardHide().subscribe(() => {
      let newHeight = this.textareaHeight - this.initialTextAreaHeight + 44;
      let marginBottom = newHeight + 'px';
      this.renderer.setElementStyle(this.scrollContentElement, 'marginBottom', marginBottom);
      this.renderer.setElementStyle(this.footerElement, 'marginBottom', '0px');
    });

    this.keybaordShowSub = this.keyboard.onKeyboardShow().subscribe(e => {
      let newHeight = e['keyboardHeight'] + this.textareaHeight - this.initialTextAreaHeight;
      let marginBottom = newHeight + 44 + 'px';
      this.renderer.setElementStyle(this.scrollContentElement, 'marginBottom', marginBottom);
      this.renderer.setElementStyle(this.footerElement, 'marginBottom', e['keyboardHeight'] + 'px');
      this.updateScroll('keybaord show', this.scrollTimeout);
    });
  }

  takePicture() {
    const loading = this.loadingCtrl.create();

    loading.present();
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
            this.sendImageMessage();
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
            this.sendImageMessage();
          });
        }
        loading.dismiss();
      },
      error => {
        alert(error);
      }
    );
  }

  presentImage(myImage) {
    const imageViewer = this.imageViewerCtrl.create(myImage);
    imageViewer.present();
    // imageViewer.onDidDismiss(() => alert('Viewer dismissed'));
  }

  sendImageMessage() {
    if (this.chosenPicture) {
      const loader = this.loadingCtrl.create();
      loader.present();
      let imageId = this.db.createPushId();

      const imageStore = firebase
        .storage()
        .ref('/ChatImages')
        .child(`${this.currentUserDetails.uid}/${this.otherUserDetails.uid}/${imageId}`);
      imageStore.putString(this.chosenPicture, 'data_url').then(res => {
        imageStore.getDownloadURL().then(url => {
          const image = {
            imageUrl: url,
            imageId: imageId,
          };
          this.chatService.sendImageMessage(this.currentUserDetails, this.otherUserDetails, image);
          loader.dismiss();
        });
      });
    }
  }
  showActionSheet(event) {
    event.preventDefault();
    const actionSheet = this.actionSheetCtrl.create({
      title: 'choose photo or video',
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
    return actionSheet.present();
  }

  fetchMessages() {
    this.chatSubscription = this.chatService
      .getMessages(this.currentUserDetails.uid, this.otherUserDetails.uid)
      .subscribe(messages => {
        this.messages = messages;
        this.updateScroll('reply message', this.scrollTimeout);
      });
  }

  sendMessage() {
    if (this.message !== '') {
      this.chatService.sendMessage(
        this.currentUserDetails,
        this.otherUserDetails,
        this.message.trim()
      );
      this.message = '';
      let currentHeight = this.scrollContentElement.style.marginBottom.replace('px', '');
      let newHeight = currentHeight - this.textareaHeight + this.initialTextAreaHeight;
      let top = newHeight + 'px';
      this.renderer.setElementStyle(this.scrollContentElement, 'marginBottom', top);
      this.updateScroll('sendMessage', this.scrollTimeout);
      this.textareaHeight = this.initialTextAreaHeight;
    }
  }

  deleteMessage(messageId) {
    this.chatService.deleteMessage(
      this.currentUserDetails.uid,
      this.otherUserDetails.uid,
      messageId
    );
  }

  presentPopover(message) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Take action');

    alert.addInput({
      type: 'radio',
      label: 'Delete',
      value: 'delete',
    });

    alert.addInput({
      type: 'radio',
      label: 'Copy',
      value: 'copy',
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        if (data === 'delete') {
          this.deleteMessage(message.key);
        } else if (data === 'copy') {
          this.clipboard.copy(message.message);
          this.presentMessage.showToast('Text copied to clipboard!');
        }
      },
    });
    alert.present();
  }

  goToProfilePage(user) {
    this.usersdata
      .child(`${user.uid}/personalData`)
      .once('value', snapshot => {
        user = snapshot.val();
      })
      .then(() => {
        this.navCtrl.push('ProfilePage', { otherUser: user });
      })
      .catch(err => {
        console.log(err);
      });
  }

  removeKeyboardListeners() {
    this.keyboardHideSub.unsubscribe();
    this.keybaordShowSub.unsubscribe();
  }

  contentMouseDown(event) {
    this.inputElement.blur();
  }

  footerTouchStart(event) {
    if (event.target.localName !== 'textarea') {
      event.preventDefault();
      this.updateScroll('', this.scrollTimeout);
    }
  }

  updateScroll(from, timeout) {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, timeout);
  }

  textAreaChange() {
    let newHeight = Number(this.inputElement.style.height.replace('px', ''));
    if (newHeight !== this.textareaHeight) {
      let diffHeight = newHeight - this.textareaHeight;
      this.textareaHeight = newHeight;
      let newNumber =
        Number(this.scrollContentElement.style.marginBottom.replace('px', '')) + diffHeight;

      let marginBottom = newNumber + 'px';
      this.renderer.setElementStyle(this.scrollContentElement, 'marginBottom', marginBottom);
      this.updateScroll('textAreaChange', this.scrollTimeout);
    }
  }

  touchSendButton(event: Event) {
    event.preventDefault();
    this.sendMessage();
  }

  goToChatSettingsPage() {
    this.navCtrl.push('ChatSettingsPage', { otherUser: this.otherUserDetails });
  }
}
