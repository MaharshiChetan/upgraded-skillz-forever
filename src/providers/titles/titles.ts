import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';
import firebase from 'firebase';

@Injectable()
export class TitlesProvider {
  uid = firebase.auth().currentUser.uid;
  constructor(private db: AngularFireDatabase) {
    console.log('Hello TitlesProvider Provider');
  }

  createTitle(title: any, pushId) {
    this.db.object(`titles/${this.uid}/${pushId}`).update(title);
  }

  getTitles(uid: string) {
    return this.db
      .list(`titles/${uid}`)
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ key: a.key, title: a.payload.val() }))));
  }

  removeTitle(key: string) {
    return this.db.object(`titles/${this.uid}/${key}`).remove();
  }

  updateTitle(titleId: string, title: any) {
    return this.db.object(`titles/${this.uid}/${titleId}`).update(title);
  }
}
