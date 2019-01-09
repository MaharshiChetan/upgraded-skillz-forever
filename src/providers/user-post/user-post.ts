import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';
import firebase from 'firebase';

@Injectable()
export class UserPostProvider {
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
      firebase
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
          this.removePostLikes(postId);
          this.removePostComments(postId);
        })
        .catch(e => alert('Error deleting the post'));
    } catch (e) {
      return e;
    }
  }

  removePostLikes(postId: string) {
    this.db.object(`userPostLikes/${postId}`).remove();
  }

  removePostComments(postId: string) {
    this.db.object(`userPostComments/${postId}`).remove();
  }

  deleteAllPost(eventId) {
    // this.getUserPosts(eventId).subscribe(posts => {
    //   this.deleteAllUserPostImages(eventId, posts);
    // });
    // this.deleteAllComments(eventId);
    // this.db.list(`eventPosts/${eventId}`).remove();
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

  likeUserPost(postId: string, uid: string) {
    this.db.object(`userPostLikes/${postId}`).update({ [uid]: true });
  }

  checkLike(postId: string, uid: string) {
    return this.db.object(`userPostLikes/${postId}/${uid}`).snapshotChanges();
  }

  getTotalLikes(postId: string) {
    // Used to build the likes count
    return this.db
      .list(`userPostLikes/${postId}`)
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ key: a.key }))));
  }

  unlikeUserPost(postId: string, uid: string) {
    this.db.object(`userPostLikes/${postId}/${uid}`).remove();
  }

  createComment(postId: string, uid: string, comment: string) {
    this.db.list(`userPostComments/${postId}`).push({
      uid: uid,
      date: '' + new Date(),
      comment: comment,
    });
  }

  deleteAllComments(postId: string) {
    this.db.object(`userPostComments/${postId}`).remove();
  }

  getAllComments(postId: string) {
    return this.db
      .list(`userPostComments/${postId}`)
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() }))));
  }

  getTotalComments(postId: string) {
    // Used to build the likes count
    return this.db
      .list(`userPostComments/${postId}`)
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ key: a.key }))));
  }

  deleteComment(postId: string, commentId: string) {
    this.db.object(`userPostComments/${postId}/${commentId}`).remove();
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
