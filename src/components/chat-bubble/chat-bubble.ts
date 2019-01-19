import { Component, Input } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';
import firebase from 'firebase';
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
  grayPlaceholder: string = 'assets/gray-placeholder.png';

  constructor(
    private navCtrl: NavController,
    private clipboard: Clipboard,
    private presentMessage: Message,
    private chatService: ChatProvider,
    private actionsheetCtrl: ActionSheetController
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

  presentPopover(message: any) {
    const actionsheet = this.actionsheetCtrl.create({
      title: 'Upload picture',
      buttons: [
        {
          text: 'Copy',
          icon: 'copy',
          handler: () => {
            if (message.imageUrl) {
              this.clipboard.copy(message.imageUrl);
            } else {
              this.clipboard.copy(message.message);
            }
            this.presentMessage.showToast('Text copied to clipboard!');
          },
        },
        {
          text: 'Delete',
          icon: 'trash',
          handler: () => {
            this.deleteMessage(message.key);
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'destructive',
          handler: () => {
            console.log('the user has cancelled the interaction.');
          },
        },
      ],
    });
    return actionsheet.present();
  }
  deleteMessage(messageId) {
    this.chatService.deleteMessage(
      this.currentUserDetails.uid,
      this.otherUserDetails.uid,
      messageId
    );
  }
}
