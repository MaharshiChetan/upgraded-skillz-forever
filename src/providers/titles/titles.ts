import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';

@Injectable()
export class TitlesProvider {
  constructor(private db: AngularFireDatabase) {
    console.log('Hello TitlesProvider Provider');
  }

  createTitle(uid: string, title) {
    this.db.list(`titles/${uid}`).push({
      title,
      created: '' + new Date(),
      uid: uid,
    });
  }

  getTitles(uid: string) {
    return this.db
      .list(`titles/${uid}`)
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ key: a.key, title: a.payload.val() }))));
  }

  removeTitle(uid: string, key: string) {
    return this.db.object(`titles/${uid}/${key}`).remove();
  }

  updateTitle(uid: string, key: string, title) {
    return this.db.object(`titles/${uid}/${key}`).update({
      title,
      updated: '' + new Date(),
      uid: uid,
    });
  }
}
