import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';
import firebase from 'firebase';

@Injectable()
export class PostProvider {
  node;
  uid = firebase.auth().currentUser.uid;
  constructor(private db: AngularFireDatabase) {}

  createEventPost(post: any, eventId: string, pushId: string) {
    return this.db
      .object(`eventPosts/${eventId}/${pushId}`)
      .update(post)
      .then(res => {
        firebase
          .database()
          .ref(`/eventPosts/${eventId}/${pushId}/timeStamp`)
          .once('value')
          .then(data => {
            const timeStamp = data.val() * -1;
            this.db.list(`eventPosts/${eventId}`).update(pushId, { timeStamp });
          });
      });
  }

  updateEventPost(post: any, eventId: string, postId: string) {
    return this.db.object(`eventPosts/${eventId}/${postId}`).update(post);
  }

  deleteAllPost(eventId: string) {
    this.getEventPosts(eventId).subscribe(posts => {
      this.deleteAllEventPostImages(eventId, posts);
    });
    this.deleteAllComments(eventId);
    this.db.list(`eventPosts/${eventId}`).remove();
  }

  deletePost(post: any, eventId: string) {
    try {
      if (post.imageId) {
        firebase
          .storage()
          .ref('/eventPostsImages')
          .child(`${eventId}/${post.imageId}`)
          .delete()
          .then(() => {
            this.db.list(`eventPosts/${eventId}/${post.key}`).remove();
            this.removePostLikes(post.key, eventId);
            this.removePostComments(post.key, eventId);
          });
      } else {
        this.db.list(`eventPosts/${eventId}/${post.key}`).remove();
        this.removePostLikes(post.key, eventId);
        this.removePostComments(post.key, eventId);
      }
    } catch (e) {
      return e;
    }
  }

  removePostLikes(postId, eventId) {
    this.db.object(`eventPostLikes/${eventId}/${postId}`).remove();
  }

  removePostComments(postId, eventId) {
    this.db.object(`eventPostComments/${eventId}/${postId}`).remove();
  }

  getEventPosts(eventId) {
    return this.db
      .list(`eventPosts/${eventId}`)
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() }))));
  }

  deleteAllLikes(eventId: string) {
    this.db.object(`eventPostLikes/${eventId}`).remove();
  }

  likeEventPost(postId: string, uid: string, eventId: string) {
    this.db.object(`eventPostLikes/${eventId}/${postId}`).update({ [uid]: true });
  }

  checkLike(postId: string, uid: string, eventId: string) {
    return this.db.object(`eventPostLikes/${eventId}/${postId}/${uid}`).snapshotChanges();
  }

  getTotalLikes(postId: string, eventId: string) {
    // Used to build the likes count
    return this.db
      .list(`eventPostLikes/${eventId}/${postId}`)
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ key: a.key }))));
  }

  unlikeEventPost(postId: string, uid: string, eventId: string) {
    this.db.object(`eventPostLikes/${eventId}/${postId}/${uid}`).remove();
  }

  createComment(postId: string, eventId: string, uid: string, comment: string) {
    this.db.list(`eventPostComments/${eventId}/${postId}`).push({
      uid: uid,
      date: '' + new Date(),
      comment: comment,
    });
  }

  deleteAllComments(eventId: string) {
    this.db.object(`eventPostComments/${eventId}`).remove();
  }

  getAllComments(postId: string, eventId: string) {
    return this.db
      .list(`eventPostComments/${eventId}/${postId}`)
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() }))));
  }

  getTotalComments(postId: string, eventId: string) {
    // Used to build the likes count
    return this.db
      .list(`eventPostComments/${eventId}/${postId}`)
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ key: a.key }))));
  }

  deleteComment(postId: string, eventId: string, commentId) {
    this.db.object(`eventPostComments/${eventId}/${postId}/${commentId}`).remove();
  }

  deleteAllEventPostImages(eventId, posts) {
    posts.forEach(post => {
      firebase
        .storage()
        .ref('/eventPostsImages')
        .child(`${eventId}/${post.imageId}`)
        .delete();
    });
  }
}
