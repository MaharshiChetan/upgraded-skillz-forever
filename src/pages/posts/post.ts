import { Component, OnInit } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { UserPostProvider } from '../../providers/user-post/user-post';

@IonicPage()
@Component({
  selector: 'post-page',
  templateUrl: 'post.html',
})
export class PostPage implements OnInit {
  posts: any;
  usersdata = firebase.database().ref('/users');
  uid = firebase.auth().currentUser.uid;
  constructor(private navParams: NavParams, private userPostService: UserPostProvider) {}

  ngOnInit() {
    this.posts = [this.navParams.get('post')];
    this.posts[0].userDetails = this.navParams.get('userDetails');
    this.getPostsDetail();
  }

  getPostsDetail() {
    this.posts.forEach((post: any, i) => {
      if (post.uid === this.uid) {
        this.posts[i].myPost = true;
      }
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
}
