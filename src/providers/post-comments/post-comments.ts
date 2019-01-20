import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';

@Injectable()
export class PostCommentsProvider {
  constructor(private db: AngularFireDatabase) {}

  createComment(postId: string, uid: string, comment: string) {
    this.db.list(`postComments/${postId}`).push({
      uid: uid,
      date: '' + new Date(),
      comment: comment,
    });
  }

  deleteAllComments(postId: string) {
    this.db.object(`postComments/${postId}`).remove();
  }

  getAllComments(postId: string) {
    return this.db
      .list(`postComments/${postId}`)
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() }))));
  }

  getTotalComments(postId: string) {
    // Used to build the likes count
    return this.db
      .list(`postComments/${postId}`)
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ key: a.key }))));
  }

  deleteComment(postId: string, commentId: string) {
    this.db.object(`postComments/${postId}/${commentId}`).remove();
  }

  removePostComments(postId: string) {
    this.db.object(`postComments/${postId}`).remove();
  }
}
