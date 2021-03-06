import { Component, OnInit } from '@angular/core';
import { IonicPage, App } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth';
import { UserPostService } from '../../providers/user-post/user-post';
import { ImageViewerController } from 'ionic-img-viewer';

@IonicPage()
@Component({
  selector: 'collections-page',
  templateUrl: 'collections.html',
})
export class CollectionsPage implements OnInit {
  uid: string = this.authService.userDetails.uid;
  imagePosts: any;
  noPost: boolean = false;

  constructor(
    private authService: AuthService,
    private userPostService: UserPostService,
    private app: App,
    private imageViewerCtrl: ImageViewerController
  ) {}

  ngOnInit() {
    this.getUserImagePosts();
  }

  presentImage(myImage: any) {
    const imageViewer = this.imageViewerCtrl.create(myImage);
    imageViewer.present();
  }

  getUserImagePosts(event?: any) {
    const subscribe = this.userPostService.getUserFirstSixPosts(this.uid).subscribe(posts => {
      this.imagePosts = posts;
      this.noPost = this.imagePosts.length > 0 ? false : true;
      if (event) event.complete();
      subscribe.unsubscribe();
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
