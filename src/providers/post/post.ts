import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';
import firebase from 'firebase';

@Injectable()
export class PostService {
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
            firebase
              .storage()
              .ref('/eventPostsImages')
              .child(`${eventId}/thumb_${post.imageId}`)
              .delete()
              .then(() => {
                this.db.list(`eventPosts/${eventId}/${post.key}`).remove();
              })
              .catch(e => alert('Error deleting the post'));
          });
      } else {
        this.db.list(`eventPosts/${eventId}/${post.key}`).remove();
      }
    } catch (e) {
      alert('Error deleting the post');
      return e;
    }
  }

  getEventPosts(eventId) {
    return this.db
      .list(`eventPosts/${eventId}`)
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() }))));
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
