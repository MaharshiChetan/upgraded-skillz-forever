import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';

@Injectable()
export class PostLikesService {
  constructor(private db: AngularFireDatabase) {}

  likePost(postId: string, uid: string) {
    this.db.object(`postLikes/${postId}`).update({ [uid]: true });
  }

  checkLike(postId: string, uid: string) {
    return this.db.object(`postLikes/${postId}/${uid}`).snapshotChanges();
  }

  getTotalLikes(postId: string) {
    // Used to build the likes count
    return this.db
      .list(`postLikes/${postId}`)
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ key: a.key }))));
  }

  unlikePost(postId: string, uid: string) {
    this.db.object(`postLikes/${postId}/${uid}`).remove();
  }

  removePostLikes(postId: string) {
    this.db.object(`postLikes/${postId}`).remove();
  }
}
