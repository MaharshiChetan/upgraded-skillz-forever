import { Component, OnInit } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ModalController,
  ActionSheetController,
  Platform,
} from 'ionic-angular';
import { UserPostProvider } from '../../providers/user-post/user-post';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'post-page',
  templateUrl: 'post.html',
})
export class PostPage implements OnInit {
  uid: string = firebase.auth().currentUser.uid;
  showMore: boolean = false;
  post: any;
  userDetails: any;

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private platform: Platform,
    private actionsheetCtrl: ActionSheetController,
    private userPostService: UserPostProvider,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.post = this.navParams.get('post');
    this.userDetails = this.navParams.get('userDetails');
    this.getPostDetail();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostsPage');
  }

  showUsers(users) {
    this.navCtrl.push('UsersLikesPage', { users: users, type: 'Likes' });
  }

  like(post) {
    this.userPostService.likeUserPost(post.key, this.uid);
  }

  unlike(post) {
    this.userPostService.unlikeUserPost(post.key, this.uid);
  }

  goToProfilePage(user: any) {
    console.log(user);

    if (this.uid === user.uid) {
      this.navCtrl.push('ProfilePage', { currentUser: user });
    } else {
      this.navCtrl.push('ProfilePage', { otherUser: user });
    }
  }

  changeContentLength() {
    this.showMore = !this.showMore;
  }

  getPostDetail() {
    if (this.uid === this.post.uid) {
      this.post.myPost = true;
    }
    this.userPostService.getTotalLikes(this.post.key).subscribe(likes => {
      this.post.likes = likes;
      this.post.totalLikes = likes.length;
    });
    this.userPostService.getTotalComments(this.post.key).subscribe(comments => {
      this.post.totalComments = comments.length;
    });
    this.userPostService.checkLike(this.post.key, this.uid).subscribe(data => {
      this.post.isLiking = data.key ? true : false;
    });
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
            this.navCtrl.pop();
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
}
