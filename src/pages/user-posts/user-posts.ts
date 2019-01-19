import { Component, OnInit } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { UserPostProvider } from '../../providers/user-post/user-post';
import { AuthProvider } from '../../providers/auth/auth';
import firebase from 'firebase';
import { App } from 'ionic-angular/components/app/app';
import { LoadingService } from '../../services/loading-service';

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
  fetched: boolean = false;
  usersdata = firebase.database().ref('/users');
  uid = firebase.auth().currentUser.uid;
  grayPlaceholder: string = 'assets/gray-placeholder.png';
  constructor(
    private navParams: NavParams,
    private userPostService: UserPostProvider,
    private app: App,
    private authService: AuthProvider,
    private loadingService: LoadingService
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
      this.loadingService.hide();
    });
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

  showPost(post: any) {
    this.app
      .getRootNav()
      .push('PostPage', { post: post, userDetails: this.authService.userDetails });
  }
}
