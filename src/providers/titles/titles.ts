import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';
import firebase from 'firebase';

@Injectable()
export class TitlesService {
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
    try {
      return firebase
        .storage()
        .ref('/titleImages')
        .child(`${this.uid}/${key}`)
        .delete()
        .then(() => {
          firebase
            .storage()
            .ref('/titleImages')
            .child(`${this.uid}/thumb_${key}`)
            .delete()
            .catch(e => alert('Error deleting the title'));
          return this.db.object(`titles/${this.uid}/${key}`).remove();
        })
        .catch(e => alert('Error deleting the title'));
    } catch (e) {
      return e;
    }
  }

  updateTitle(titleId: string, title: any) {
    return this.db.object(`titles/${this.uid}/${titleId}`).update(title);
  }
}
