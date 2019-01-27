import { Component, OnInit } from '@angular/core';
import { IonicPage, App } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth';

import { LoadingService } from '../../services/loading-service';
import { FollowService } from '../../providers/follow/follow';
import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';

@IonicPage()
@Component({
  selector: 'home-page',
  templateUrl: 'home.html',
})
export class HomePage implements OnInit {
  userDetails: any;
  grayPlaceholder: string = 'assets/gray-placeholder.png';
  cards = [
    {
      avatarImageUrl: 'assets/img/avatar/marty-avatar.png',
      postImageUrl: 'assets/img/card/advance-card-bttf.png',
      name: 'Marty Mcfly',
      postText:
        'Wait a minute. Wait a minute, Doc. Uhhh... Are you telling me that you built a time machine... out of a DeLorean?! Whoa. This is heavy.',
      date: 'November 5, 1955',
      likes: 12,
      comments: 4,
      timestamp: '11h ago',
    },
    {
      avatarImageUrl: 'assets/img/avatar/sarah-avatar.jpg',
      postImageUrl: 'assets/img/card/advance-card-tmntr.jpg',
      name: 'Sarah Connor',
      postText:
        'I face the unknown future, with a sense of hope. Because if a machine, a Terminator, can learn the value of human life, maybe we can too.',
      date: 'May 12, 1984',
      likes: 30,
      comments: 64,
      timestamp: '30yr ago',
    },
    {
      avatarImageUrl: 'assets/img/avatar/ian-avatar.png',
      postImageUrl: 'assets/img/card/advance-card-jp.jpg',
      name: 'Dr. Ian Malcolm',
      postText:
        "Your scientists were so preoccupied with whether or not they could, that they didn't stop to think if they should.",
      date: 'June 28, 1990',
      likes: 46,
      comments: 66,
      timestamp: '2d ago',
    },
  ];
  recentPosts: any[] = [];
  followings: any[];
  constructor(
    private authService: AuthService,
    private app: App,
    private loadingService: LoadingService,
    private followService: FollowService,
    private db: AngularFireDatabase
  ) {}

  ngOnInit() {
    this.fetchCurrentUserProfile(null);
  }

  fetchCurrentUserProfile(refresher) {
    if (this.authService.currentUserDetails) {
      this.userDetails = this.authService.currentUserDetails;
      // this.fetchFollowings();
    } else {
      this.authService.getUserDetails().then(data => {
        this.userDetails = data;
        // this.fetchFollowings();
      });
    }
    if (refresher) refresher.complete();
  }

  goToProfilePage() {
    this.loadingService.show();
    this.app.getRootNav().push('ProfilePage', { currentUser: this.authService.currentUserDetails });
  }

  fetchFollowings() {
    this.followService.getFollowings(this.userDetails.uid).subscribe((followings: any) => {
      this.followings = followings;
      console.log(this.followings);
      this.fetchPosts();
    });
  }

  fetchPosts() {
    const date = new Date();
    const timestamp: number = -new Date(date.getTime() - 1 * 24 * 60 * 60 * 1000).getTime();
    console.log(timestamp);
    this.followings.forEach(uid => {
      this.db
        .list(`userPosts/${uid.key}`, ref => ref.orderByChild('timeStamp').endAt(timestamp))
        .snapshotChanges()
        .pipe(map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() }))))
        .subscribe(post => {
          this.recentPosts.push(...post);
          console.log(this.recentPosts);
        });
    });
  }
}
