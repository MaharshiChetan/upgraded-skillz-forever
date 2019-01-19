import { Component, Input } from '@angular/core';
import {
  NavController,
  ModalController,
  Platform,
  ActionSheetController,
  AlertController,
} from 'ionic-angular';
import { UserPostProvider } from '../../providers/user-post/user-post';
import { ImageViewerController } from 'ionic-img-viewer';
import firebase from 'firebase';
import { LoadingService } from '../../services/loading-service';

@Component({
  selector: 'post',
  templateUrl: 'post.html',
})
export class PostComponent {
  @Input('posts') posts: any;
  uid: string = firebase.auth().currentUser.uid;
  showMore: boolean = false;
  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private platform: Platform,
    private actionsheetCtrl: ActionSheetController,
    private userPostService: UserPostProvider,
    private alertCtrl: AlertController,
    private imageViewerCtrl: ImageViewerController,
    private loadingService: LoadingService
  ) {}

  presentImage(image: any) {
    const imageViewer = this.imageViewerCtrl.create(image);
    imageViewer.present();
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

  presentPopover(post) {
    const actionsheet = this.actionsheetCtrl.create({
      title: 'Take Action',
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
            this.loadingService.show('Deleting post...');
            this.userPostService.deletePost(post, post.key);
            if (this.posts.length < 3) {
              this.navCtrl.pop();
            }
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
