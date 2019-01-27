import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'users-likes-page',
  templateUrl: 'users-likes.html',
})
export class UsersLikesPage implements OnInit {
  users = [];
  userKeys = [];
  type;
  loader;
  loadingText;
  grayPlaceholder: string = 'assets/gray-placeholder.png';
  usersdata = firebase.database().ref('/users');
  constructor(private navCtrl: NavController, private navParams: NavParams) {}

  ngOnInit() {
    this.userKeys = this.navParams.get('users');
    this.type = this.navParams.get('type');
    this.fetchUsers();
    this.initializeLoader();
  }

  initializeLoader() {
    this.loader = this.users.length >= this.userKeys.length ? 'false' : '';
    this.loadingText =
      this.users.length >= this.userKeys.length ? 'Completed' : 'Loading more users...';
  }

  fetchUsers() {
    return new Promise((resolve, reject) => {
      for (let i = this.users.length; i < this.users.length + 10; i++) {
        this.initializeLoader();
        if (i >= this.userKeys.length) {
          break;
        }
        this.usersdata
          .child(`${this.userKeys[i].key}/personalData`)
          .once('value', snapshot => {
            this.users.push(snapshot.val());
          })
          .then(() => {
            resolve(true);
          })
          .catch(() => {
            reject(false);
          });
      }
    });
  }

  doInfinite(infiniteScroll) {
    this.fetchUsers()
      .then(() => {
        infiniteScroll.complete();
      })
      .catch(() => {
        alert('Something went wrong');
      });
  }

  goToProfilePage(user) {
    if (firebase.auth().currentUser.uid === user.uid) {
      this.navCtrl.push('ProfilePage', { currentUser: user });
    } else {
      this.navCtrl.push('ProfilePage', { otherUser: user });
    }
  }
}
