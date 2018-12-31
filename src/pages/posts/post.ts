import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ModalController,
} from 'ionic-angular';
import { UserPostProvider } from '../../providers/user-post/user-post';
import firebase from 'firebase';
import { PhotoViewer } from '@ionic-native/photo-viewer';

@IonicPage()
@Component({
  selector: 'post-page',
  templateUrl: 'post.html',
})
export class PostPage {
  uid: string = firebase.auth().currentUser.uid;
  showMore: boolean = false;
  post: any;
  userDetails: any;

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private userPostService: UserPostProvider,
    private photoViewer: PhotoViewer,
    private alertCtrl: AlertController
  ) {}

  ionViewWillEnter() {
    this.post = this.navParams.get('post');
    this.userDetails = this.navParams.get('userDetails');
    console.log(this.post);
    console.log(this.userDetails);
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

  presentImage(image: string) {
    this.photoViewer.show(image, '', { share: true });
  }

  presentPopover(post) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Take action');

    alert.addInput({
      type: 'radio',
      label: 'Delete',
      value: 'delete',
    });
    alert.addInput({
      type: 'radio',
      label: 'Edit',
      value: 'edit',
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        if (data === 'delete') {
          this.userPostService.deletePost(post, post.key);
        } else if (data === 'edit') {
          this.navCtrl.push('CreatePostPage', {
            post: post,
            type: 'userPost',
          });
        }
      },
    });
    alert.present();
  }

  openCommentsModal(post: any) {
    const modal = this.modalCtrl.create('CommentsPage', {
      post: post,
    });
    modal.present();
  }
}
