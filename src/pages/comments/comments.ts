import { Component, HostListener, ElementRef, ViewChild, OnInit } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  ActionSheetController,
  Platform,
} from 'ionic-angular';
import firebase from 'firebase';
import { AuthService } from '../../providers/auth/auth';
import { Clipboard } from '@ionic-native/clipboard';
import { PostCommentsService } from '../../providers/post-comments/post-comments';
import { ToastService } from '../../services/toast-service';

@IonicPage()
@Component({
  selector: 'comments-page',
  templateUrl: 'comments.html',
})
export class CommentsPage implements OnInit {
  @ViewChild('content')
  content: any;
  post: any;
  comments: any;
  usersdata = firebase.database().ref('/users');
  currentUserDetails: any;
  commentText: any;
  constructor(
    private platform: Platform,
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private navCtrl: NavController,
    private element: ElementRef,
    private authService: AuthService,
    private toastService: ToastService,
    private actionSheetCtrl: ActionSheetController,
    private clipboard: Clipboard,
    private postCommentService: PostCommentsService
  ) {}

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom(300); //300ms animation speed
    }, 800);
  }

  ngOnInit() {
    this.fetchCurrentUserProfile();
    this.post = this.navParams.get('post');
    this.getAllPostComments(this.post.key);
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

  getAllPostComments(postKey: string) {
    this.postCommentService.getAllComments(postKey).subscribe(comments => {
      this.comments = comments;
      this.comments.forEach((comment: any, i: number) => {
        this.usersdata.child(`${comment.uid}/personalData`).once('value', snapshot => {
          this.comments[i].userDetails = snapshot.val();
        });
      });
      this.scrollToBottom();
    });
  }

  createPostComment(comment: any) {
    if (comment.value === '') {
      return this.toastService.presentToast('Enter some comment!');
    }
    this.postCommentService.createComment(
      this.post.key,
      firebase.auth().currentUser.uid,
      comment.value
    );
    this.commentText = '';
  }

  showActionSheet(postId: string, comment: any) {
    if (comment.uid === firebase.auth().currentUser.uid) {
      const actionSheet = this.actionSheetCtrl.create({
        title: 'Take Action',
        buttons: [
          {
            text: 'Delete',
            icon: 'trash',
            handler: () => {
              this.postCommentService.deleteComment(postId, comment.key);
            },
          },
          {
            text: 'Copy',
            icon: 'copy',
            handler: () => {
              this.clipboard.copy(comment.comment);
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

  goToProfilePage(user: any) {
    if (firebase.auth().currentUser.uid === user.uid) {
      this.navCtrl.push('ProfilePage', { currentUser: user });
    } else {
      this.navCtrl.push('ProfilePage', { user: user });
    }
  }
}
