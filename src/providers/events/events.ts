import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';

@Injectable()
export class EventsProvider {
  imageStore = firebase.storage().ref('/eventImages');

  constructor(private db: AngularFireDatabase) {}

  createEvent(event: any, key: string) {
    try {
      return this.db
        .object(`events/${key}`)
        .update(event)
        .then(_ => {
          // After successful push, get timestamp and overwrite with negative value
          firebase
            .database()
            .ref(`/events/${key}/timeStamp`)
            .once('value')
            .then(data => {
              const timeStamp = data.val() * -1;
              this.db.list(`/events/`).update(key, { timeStamp });
            });
        });
    } catch (e) {
      alert(e);
      console.log(e);
    }
  }

  updateEvent(event: any, key: string) {
    try {
      return this.db.object(`events/${key}`).update(event);
    } catch (e) {
      console.log(e);
    }
  }

  fetchEvents() {
    try {
      return this.db
        .list('events', ref => ref.orderByChild('startDate'))
        .snapshotChanges()
        .pipe(map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() }))));
    } catch (e) {
      console.log(e);
    }
  }

  deleteEvent(event) {
    try {
      this.imageStore
        .child(`${firebase.auth().currentUser.uid}/${event.imageId}`)
        .delete()
        .then(() => {
          return this.db.list(`${event.key}`).remove();
        });
    } catch (e) {
      return e;
    }
  }

  fetchActivePeopleForEvents(eventKey: string, type: string) {
    try {
      return this.db
        .list(`activePeopleForEvents/${eventKey}/${type}`)
        .snapshotChanges()
        .pipe(map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() }))));
    } catch (e) {
      console.log(e);
    }
  }

  incrementInterestedOrGoing(eventKey: string, uid: string, type: string) {
    try {
      return this.db.object(`activePeopleForEvents/${eventKey}/${type}`).update({ [uid]: true });
    } catch (e) {
      return e;
    }
  }

  decrementInterestedOrGoing(eventKey: string, uid: string, type: string) {
    try {
      this.db.object(`activePeopleForEvents/${eventKey}/${type}/${uid}`).remove();
    } catch (e) {
      return e;
    }
  }

  isInterestedOrGoing(eventKey: string, uid: string, type: string) {
    try {
      return this.db
        .object(`activePeopleForEvents/${eventKey}/${type}/${uid}`)
        .snapshotChanges()
        .pipe(map(actions => actions.payload.val()));
    } catch (e) {
      return e;
    }
  }

  incrementShare(eventKey: string, uid: string) {
    try {
      return this.db.object(`activePeopleForEvents/${eventKey}/shares`).update({ [uid]: true });
    } catch (e) {
      return e;
    }
  }
}
