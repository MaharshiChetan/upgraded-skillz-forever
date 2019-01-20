import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'chat-settings-page',
  templateUrl: 'chat-settings.html',
})
export class ChatSettingsPage implements OnInit {
  userDetails: any;
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private chatService: ChatProvider,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.userDetails = this.navParams.get('otherUser');
  }

  showBlockAlert() {
    const confirm = this.alertCtrl.create({
      title: `Block ${this.userDetails.userName}?`,
      message:
        "They won't be able to find your profile and posts on skillz-forever. We won't let them know you blocked them.",
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Disagree clicked');
          },
        },
        {
          text: 'Block',
          handler: () => {
            console.log('Agree clicked');
          },
        },
      ],
    });
    confirm.present();
  }

  showDeleteAlert() {
    const confirm = this.alertCtrl.create({
      title: `Delete Conversation`,
      message: 'Are you sure you want to delete this conversation?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Disagree clicked');
          },
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteChat();
          },
        },
      ],
    });
    confirm.present();
  }

  deleteChat() {
    this.chatService.deleteAllMessages(firebase.auth().currentUser.uid, this.userDetails.key);
    this.navCtrl.pop().then(() => this.navCtrl.pop());
  }
  goToProfilePage() {
    this.navCtrl.push('ProfilePage', { otherUser: this.userDetails });
  }
}
