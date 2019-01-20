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
import { PostProvider } from '../../providers/post/post';
import { PostLikesProvider } from '../../providers/post-likes/post-likes';
import { PostCommentsProvider } from '../../providers/post-comments/post-comments';

@Component({
  selector: 'post',
  templateUrl: 'post.html',
})
export class PostComponent {
  @Input('posts') posts: any;
  @Input('eventId') eventId: string;
  grayPlaceholder: string = 'assets/gray-placeholder.png';
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
    private loadingService: LoadingService,
    private postService: PostProvider,
    private postLikesService: PostLikesProvider,
    private postCommentsService: PostCommentsProvider
  ) {}

  presentImage(image: any) {
    const imageViewer = this.imageViewerCtrl.create(image);
    imageViewer.present();
  }

  showUsers(users: any) {
    this.navCtrl.push('UsersLikesPage', { users: users, type: 'Likes' });
  }

  likePost(post: any) {
    this.postLikesService.likePost(post.key, this.uid);
  }

  unlikePost(post: any) {
    this.postLikesService.unlikePost(post.key, this.uid);
  }

  goToProfilePage(user: any) {
    if (this.uid === user.uid) {
      this.navCtrl.push('ProfilePage', { currentUser: user });
    } else {
      this.navCtrl.push('ProfilePage', { otherUser: user });
    }
  }

  changeContentLength() {
    this.showMore = !this.showMore;
  }

  presentPopover(post: any) {
    const actionsheet = this.actionsheetCtrl.create({
      title: 'Take Action',
      buttons: [
        {
          text: 'Edit',
          icon: !this.platform.is('ios') ? 'create' : null,
          handler: () => {
            this.editPost(post);
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
            this.deletePost(post);
          },
        },
      ],
    });
    confirm.present();
  }

  editPost(post: any) {
    if (this.eventId) {
      this.navCtrl.push('CreatePostPage', {
        eventId: this.eventId,
        post: post,
      });
    } else {
      this.navCtrl.push('CreatePostPage', {
        post: post,
        type: 'userPost',
      });
    }
  }

  deletePost(post: any) {
    this.loadingService.show('Deleting post...');
    if (this.eventId) {
      this.postService.deletePost(post, this.eventId);
      this.postLikesService.removePostLikes(post.key);
      this.postCommentsService.removePostComments(post.key);
    } else {
      this.userPostService.deletePost(post, post.key);
      this.postLikesService.removePostLikes(post.key);
      this.postCommentsService.removePostComments(post.key);
    }
    if (this.posts.length < 3) {
      this.navCtrl.pop();
    }
    this.loadingService.hide();
  }

  openCommentsModal(post: any) {
    if (this.eventId) {
      const modal = this.modalCtrl.create('CommentsPage', {
        post: post,
        eventId: this.eventId,
      });
      modal.present();
    } else {
      const modal = this.modalCtrl.create('CommentsPage', {
        post: post,
      });
      modal.present();
    }
  }
}
