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
