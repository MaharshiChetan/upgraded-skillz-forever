import { Component, HostListener, ElementRef, ViewChild } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  ActionSheetController,
  Platform,
} from 'ionic-angular';
import { PostProvider } from '../../providers/post/post';
import firebase from 'firebase';
import { AuthProvider } from '../../providers/auth/auth';
import { Message } from '../../providers/message/message';
import { UserPostProvider } from '../../providers/user-post/user-post';

@IonicPage()
@Component({
  selector: 'comments-page',
  templateUrl: 'comments.html',
})
export class CommentsPage {
  @ViewChild('content')
  content: any;

  post: any;
  eventId: string;
  comments: any;
  usersdata = firebase.database().ref('/users');
  currentUserDetails: any;
  commentText: any;
  constructor(
    private navCtrl: NavController,
    private platform: Platform,
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private element: ElementRef,
    private postService: PostProvider,
    private userPostService: UserPostProvider,
    private authService: AuthProvider,
    private presentMessage: Message,
    private actionSheetCtrl: ActionSheetController
  ) {}

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom(300); //300ms animation speed
    }, 800);
  }

  ionViewDidLoad() {
    this.fetchCurrentUserProfile();
    this.post = this.navParams.get('post');
    this.eventId = this.navParams.get('eventId');
    if (this.eventId) {
      this.getAllEventPostComments(this.post.key, this.eventId);
    } else {
      this.getAllUserPostComments(this.post.key);
    }
  }

  @HostListener('document:keydown.enter', ['$event'])
  onKeydownHandler(evt: KeyboardEvent) {
    this.adjust();
  }

  ngAfterViewInit() {
    this.adjust();
  }

  adjust(): void {
    let textArea = this.element.nativeElement.getElementsByTagName('textarea')[0];
    textArea.style.overflow = 'hidden';
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + 1 + 'px';
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  fetchCurrentUserProfile() {
    this.authService.getUserDetails().then(user => {
      this.currentUserDetails = user;
    });
  }

  getAllEventPostComments(postKey: string, eventId: string) {
    this.postService.getAllComments(postKey, eventId).subscribe(comments => {
      this.comments = comments;
      this.comments.forEach((comment, i) => {
        this.usersdata.child(`${comment.uid}/personalData`).once('value', snapshot => {
          this.comments[i].userDetails = snapshot.val();
        });
      });
      this.scrollToBottom();
    });
  }

  getAllUserPostComments(postKey: string) {
    this.userPostService.getAllComments(postKey).subscribe(comments => {
      this.comments = comments;
      this.comments.forEach((comment: any, i: number) => {
        this.usersdata.child(`${comment.uid}/personalData`).once('value', snapshot => {
          this.comments[i].userDetails = snapshot.val();
        });
      });
      this.scrollToBottom();
    });
  }

  createEventPostComment(comment: any) {
    if (comment.value === '') {
      return this.presentMessage.showToast('Enter some comment!', 'fail-toast');
    }
    this.postService.createComment(
      this.post.key,
      this.eventId,
      firebase.auth().currentUser.uid,
      comment.value
    );
    this.commentText = '';
  }

  createUserPostComment(comment: any) {
    if (comment.value === '') {
      return this.presentMessage.showToast('Enter some comment!', 'fail-toast');
    }
    this.userPostService.createComment(
      this.post.key,
      firebase.auth().currentUser.uid,
      comment.value
    );
    this.commentText = '';
  }

  showActionSheet(postId: string, eventId: string, commentId: string, uid: string) {
    if (uid === firebase.auth().currentUser.uid) {
      const actionSheet = this.actionSheetCtrl.create({
        title: 'Take Action',
        buttons: [
          {
            text: 'Delete',
            icon: 'trash',
            handler: () => {
              if (eventId) {
                this.postService.deleteComment(postId, eventId, commentId);
              } else {
                this.userPostService.deleteComment(postId, commentId);
              }
            },
          },
          {
            text: 'Copy',
            icon: 'md-copy',
            handler: () => {
              console.log('copy');
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
  }

  goToProfilePage(user) {
    if (firebase.auth().currentUser.uid === user.uid) {
      this.navCtrl.push('ProfilePage', { currentUser: user });
    } else {
      this.navCtrl.push('ProfilePage', { user: user });
    }
  }
}
