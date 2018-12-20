import { Component, Input } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { ImageViewerController } from 'ionic-img-viewer';
import { Message } from '../../providers/message/message';
import { Clipboard } from '@ionic-native/clipboard';
import { ChatProvider } from '../../providers/chat/chat';

@Component({
  selector: 'chat-bubble',
  templateUrl: 'chat-bubble.html',
})
export class ChatBubbleComponent {
  @Input('messages') messages: any;
  @Input('otherUserDetails') otherUserDetails: any;
  @Input('currentUserDetails') currentUserDetails: any;
  usersdata = firebase.database().ref('/users');

  constructor(
    private navCtrl: NavController,
    private imageViewerCtrl: ImageViewerController,
    private clipboard: Clipboard,
    private presentMessage: Message,
    private chatService: ChatProvider,
    private alertCtrl: AlertController
  ) {}

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

  presentImage(myImage: any) {
    const imageViewer = this.imageViewerCtrl.create(myImage);
    imageViewer.present();
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

  deleteMessage(messageId) {
    this.chatService.deleteMessage(
      this.currentUserDetails.uid,
      this.otherUserDetails.uid,
      messageId
    );
  }
}
