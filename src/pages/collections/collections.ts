import { Component } from '@angular/core';
import { IonicPage, App } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { UserPostProvider } from '../../providers/user-post/user-post';
import { ImageViewerController } from 'ionic-img-viewer';

@IonicPage()
@Component({
  selector: 'collections-page',
  templateUrl: 'collections.html',
})
export class CollectionsPage {
  uid: string = this.authService.userDetails.uid;
  imagePosts: any;
  videoPosts: any;
  audioPosts: any;
  noPost: boolean = false;
  grayPlaceholder: string = 'assets/gray-placeholder.png';

  constructor(
    private authService: AuthProvider,
    private userPostService: UserPostProvider,
    private app: App,
    private imageViewerCtrl: ImageViewerController
  ) {}

  ionViewWillLoad() {
    this.getUserImagePosts();
  }

  presentImage(myImage: any) {
    const imageViewer = this.imageViewerCtrl.create(myImage);
    imageViewer.present();
  }

  getUserImagePosts(event?: any) {
    this.userPostService.getUserFirstSixPosts(this.uid).subscribe(posts => {
      this.imagePosts = posts;
      this.noPost = this.imagePosts.length > 0 ? false : true;
      if (event) event.complete();
    });
  }

  getUserVideoPosts() {
    this.userPostService.getUserPosts(this.uid).subscribe(posts => {
      this.videoPosts = posts;
      this.noPost = this.imagePosts.length > 0 ? false : true;
    });
  }

  getUserAudioPosts() {
    this.userPostService.getUserPosts(this.uid).subscribe(posts => {
      this.audioPosts = posts;
      this.noPost = this.imagePosts.length > 0 ? false : true;
    });
  }

  /* showPost(post: any) {
    this.app
      .getRootNav()
      .push('PostPage', { post: post, userDetails: this.authService.userDetails });
  } */

  goToUserPostsPage() {
    this.app.getRootNav().push('UserPostsPage', { uid: this.uid });
  }
}
