import { Component, OnInit } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { UserPostService } from '../../providers/user-post/user-post';
import firebase from 'firebase';
import { LoadingService } from '../../services/loading-service';
import { PostLikesService } from '../../providers/post-likes/post-likes';
import { PostCommentsService } from '../../providers/post-comments/post-comments';

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
  constructor(
    private navParams: NavParams,
    private userPostService: UserPostService,
    private loadingService: LoadingService,
    private postLikesService: PostLikesService,
    private postCommentsService: PostCommentsService
  ) {}

  ngOnInit() {
    this.postUid = this.navParams.get('uid');
    this.getUserPosts();
  }

  getUserPosts(event?: any) {
    const subscribe = this.userPostService.getUserPosts(this.postUid).subscribe(posts => {
      this.fetched = false;
      this.posts = posts;
      this.getPostsDetail();
      this.loadingService.hide();
      subscribe.unsubscribe();
      if (event) event.complete();
    });
  }

  getPostsDetail() {
    if (!this.fetched) {
      this.posts.forEach((post: any, i: number) => {
        this.usersdata.child(`${post.uid}/personalData`).once('value', snapshot => {
          this.posts[i].userDetails = snapshot.val();
          if (post.uid === firebase.auth().currentUser.uid) {
            this.posts[i].myPost = true;
          }
        });
        this.postLikesService.checkLike(post.key, this.uid).subscribe(data => {
          this.posts[i].isLiking = data.key ? true : false;
          const likeSubscription = this.postLikesService
            .getTotalLikes(post.key)
            .subscribe(likes => {
              this.posts[i].likes = likes;
              this.posts[i].totalLikes = likes.length;
              likeSubscription.unsubscribe();
            });
          const commentSubscription = this.postCommentsService
            .getTotalComments(post.key)
            .subscribe(comments => {
              this.posts[i].totalComments = comments.length;
              commentSubscription.unsubscribe();
            });
        });
      });
    }
    this.fetched = true;
  }
}
