import { Component, OnInit } from '@angular/core';
import {
  IonicPage,
  NavParams,
  ModalController,
  NavController,
  ActionSheetController,
  AlertController,
} from 'ionic-angular';
import { UserPostProvider } from '../../providers/user-post/user-post';
import { AuthProvider } from '../../providers/auth/auth';
import firebase from 'firebase';
import { App } from 'ionic-angular/components/app/app';
import { Platform } from 'ionic-angular/platform/platform';

@IonicPage()
@Component({
  selector: 'user-posts-page',
  templateUrl: 'user-posts.html',
})
export class UserPostsPage implements OnInit {
  postUid: string;
  type: string = 'ThumbnailPost';
  posts: any;
  showMore: boolean = false;
  usersdata = firebase.database().ref('/users');
  fetched: boolean = false;
  uid = firebase.auth().currentUser.uid;
  grayPlaceholder: string = 'assets/gray-placeholder.png';
  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private navCtrl: NavController,
    private userPostService: UserPostProvider,
    private alertCtrl: AlertController,
    private platform: Platform,
    private actionsheetCtrl: ActionSheetController,
    private app: App,
    private authService: AuthProvider
  ) {}

  ngOnInit() {
    this.postUid = this.navParams.get('uid');
    this.getUserPosts(this.postUid);
  }

  getUserPosts(uid: string) {
    this.userPostService.getUserPosts(uid).subscribe(posts => {
      this.fetched = false;
      this.posts = posts;
      this.getPostsDetail();
    });
  }

  showUsers(users: any) {
    this.navCtrl.push('UsersLikesPage', { users: users, type: 'Likes' });
  }

  like(post: any) {
    this.userPostService.likeUserPost(post.key, this.uid);
  }

  unlike(post: any) {
    this.userPostService.unlikeUserPost(post.key, this.uid);
  }

  goToProfilePage(user: any) {
    if (this.postUid === user.uid) {
      this.navCtrl.push('ProfilePage', { currentUser: user });
    } else {
      this.navCtrl.push('ProfilePage', { otherUser: user });
    }
  }

  changeContentLength() {
    this.showMore = !this.showMore;
  }

  getPostsDetail() {
    if (!this.fetched) {
      this.posts.forEach((post: any, i) => {
        this.usersdata.child(`${post.uid}/personalData`).once('value', snapshot => {
          this.posts[i].userDetails = snapshot.val();
          if (post.uid === firebase.auth().currentUser.uid) {
            this.posts[i].myPost = true;
          }
        });
        this.userPostService.getTotalLikes(post.key).subscribe(likes => {
          this.posts[i].likes = likes;
          this.posts[i].totalLikes = likes.length;
        });
        this.userPostService.getTotalComments(post.key).subscribe(comments => {
          this.posts[i].totalComments = comments.length;
        });
        this.userPostService.checkLike(post.key, this.uid).subscribe(data => {
          this.posts[i].isLiking = data.key ? true : false;
        });
      });
    }
    this.fetched = true;
  }

  presentPopover(post) {
    const actionsheet = this.actionsheetCtrl.create({
      title: 'Upload Picture',
      buttons: [
        {
          text: 'Edit',
          icon: !this.platform.is('ios') ? 'create' : null,
          handler: () => {
            this.navCtrl.push('CreatePostPage', {
              post: post,
              type: 'userPost',
            });
          },
        },
        {
          text: 'Delete',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            this.showConfirmAlert(post);
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

  showConfirmAlert(post: any) {
    const confirm = this.alertCtrl.create({
      title: 'Confirm Deletion',
      message: 'Delete this post?',
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
            this.userPostService.deletePost(post, post.key);
          },
        },
      ],
    });
    confirm.present();
  }

  openCommentsModal(post: any) {
    const modal = this.modalCtrl.create('CommentsPage', {
      post: post,
    });
    modal.present();
  }

  showPost(post: any) {
    this.app
      .getRootNav()
      .push('PostPage', { post: post, userDetails: this.authService.userDetails });
  }
}
