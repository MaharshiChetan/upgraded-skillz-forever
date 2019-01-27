import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';
import firebase from 'firebase';

@Injectable()
export class UserPostService {
  uid = firebase.auth().currentUser.uid;
  constructor(private db: AngularFireDatabase) {}

  createUserPost(post: any, pushId: string) {
    return this.db
      .object(`userPosts/${this.uid}/${pushId}`)
      .update(post)
      .then(res => {
        firebase
          .database()
          .ref(`/userPosts/${this.uid}/${pushId}/timeStamp`)
          .once('value')
          .then(data => {
            const timeStamp = data.val() * -1;
            this.db.list(`userPosts/${this.uid}`).update(pushId, { timeStamp });
          });
      });
  }

  updateUserPost(post: any, postId: string) {
    return this.db.object(`userPosts/${this.uid}/${postId}`).update(post);
  }

  deletePost(post: any, postId: string) {
    try {
      return firebase
        .storage()
        .ref('/userPostsImages')
        .child(`${this.uid}/${post.imageId}`)
        .delete()
        .then(() => {
          firebase
            .storage()
            .ref('/userPostsImages')
            .child(`${this.uid}/thumb_${post.imageId}`)
            .delete()
            .catch(e => alert('Error deleting the post'));
          this.db.list(`userPosts/${this.uid}/${postId}`).remove();
        })
        .catch(e => alert('Error deleting the post'));
    } catch (e) {
      return e;
    }
  }

  getUserPosts(uid: string) {
    return this.db
      .list(`userPosts/${uid}`, ref => ref.orderByChild('timeStamp'))
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() }))));
  }

  getUserFirstSixPosts(uid: string) {
    return this.db
      .list(`userPosts/${uid}`, ref => ref.orderByChild('timeStamp').limitToFirst(6))
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() }))));
  }

  deleteAllUserPostImages(posts: any) {
    posts.forEach((post: any) => {
      firebase
        .storage()
        .ref('/userPostsImages')
        .child(`${this.uid}/${post.imageId}`)
        .delete();
    });
  }
}
