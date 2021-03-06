import { Component, OnInit } from '@angular/core';
import { IonicPage, App, ActionSheetController, Platform } from 'ionic-angular';
import { ChatService } from '../../providers/chat/chat';
import firebase from 'firebase';
import _ from 'lodash';
import moment from 'moment';
import 'rxjs/add/operator/debounceTime';
import { DataService } from '../../providers/data/data';
import { AuthService } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'chat-list-page',
  templateUrl: 'chat-list.html',
})
export class ChatListPage implements OnInit {
  loader;
  searchTerm;
  loadingText;
  displayMessages;
  usersdata = firebase.database().ref('/users');
  subscription: any;
  searchMessages;
  messages: boolean = false;
  currentUserId: string;
  grayPlaceholder: string = 'assets/gray-placeholder.png';

  constructor(
    private platform: Platform,
    private chatService: ChatService,
    private dataService: DataService,
    private authService: AuthService,
    private app: App,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    this.authService.getUserDetails().then(userData => {
      this.currentUserId = userData['uid'];
      this.getDisplayMessages();
      this.initializeLoader();
    });
  }

  ionViewDidLeave() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  initializeLoader() {
    // this.loader = this.users.length >= this.userKeys.length ? 'false' : '';
    // this.loadingText =
    //   this.displayMessages.length >= this.userKeys.length
    //     ? 'Completed'
    //     : 'Loading more chats...';
  }

  getDisplayMessages() {
    this.subscription = this.chatService
      .getDisplayMessages(this.currentUserId)
      .subscribe(displayMessages => {
        if (displayMessages.length > 0) {
          this.messages = true;
        } else {
          this.messages = false;
        }
        this.displayMessages = _.sortBy(displayMessages, function(o) {
          return moment(o['timeStamp']);
        }).reverse();

        this.searchMessages = this.displayMessages;
      });
  }

  fetchDisplayMessages(refresh) {
    this.getDisplayMessages();
    refresh.complete();
  }

  deleteAllMessages(message) {
    this.chatService.deleteAllMessages(firebase.auth().currentUser.uid, message.key);
  }

  doInfinite(infiniteScroll) {
    /* this.fetchUsers()
      .then(() => {
        infiniteScroll.complete();
      })
      .catch(() => {
        alert('Something went wrong');
      }); */
  }

  showActionSheet(message: string) {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Take Action',
      buttons: [
        {
          text: 'Delete',
          icon: 'trash',
          handler: () => {
            this.deleteAllMessages(message);
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

  goToChatPage(user) {
    this.app.getRootNav().push('OneToOneChatPage', { userDetails: user });
  }

  setFilteredItems(event) {
    this.displayMessages = this.dataService.filterMessages(this.searchMessages, this.searchTerm);
  }

  goToSearchUserPage() {
    this.app.getRootNav().push('SearchUserPage');
  }
}
