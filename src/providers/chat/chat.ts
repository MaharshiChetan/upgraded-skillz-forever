import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';

@Injectable()
export class ChatService {
  constructor(private db: AngularFireDatabase) {}

  sendImageMessage(sender, receiver, image) {
    this.db.list(`chats/${sender.uid}/${receiver.uid}/messages`).push({
      imageUrl: image.imageUrl,
      imageId: image.imageId,
      sentBy: sender.uid,
      timeStamp: '' + new Date(),
    });
    this.db.object(`displayChats/${sender.uid}/${receiver.uid}`).update({
      imageUrl: image.imageUrl,
      imageId: image.imageId,
      sentBy: sender.uid,
      userName: receiver.userName,
      profilePhoto: receiver.profilePhoto,
      displayName: receiver.displayName,
      bio: receiver.bio || '',
      timeStamp: '' + new Date(),
    });
    this.db.list(`chats/${receiver.uid}/${sender.uid}/messages`).push({
      imageUrl: image.imageUrl,
      imageId: image.imageId,
      sentBy: sender.uid,
      timeStamp: '' + new Date(),
    });
    this.db.object(`displayChats/${receiver.uid}/${sender.uid}`).update({
      imageUrl: image.imageUrl,
      imageId: image.imageId,
      sentBy: sender.uid,
      userName: sender.userName,
      profilePhoto: sender.profilePhoto,
      displayName: sender.displayName,
      bio: sender.bio || '',
      timeStamp: '' + new Date(),
    });
  }
  sendMessage(sender, receiver, message) {
    this.db.list(`chats/${sender.uid}/${receiver.uid}/messages`).push({
      message: message,
      sentBy: sender.uid,
      timeStamp: '' + new Date(),
    });
    this.db.object(`displayChats/${sender.uid}/${receiver.uid}`).update({
      message: message,
      sentBy: sender.uid,
      userName: receiver.userName,
      profilePhoto: receiver.profilePhoto,
      thumbnail: receiver.thumbnail || receiver.profilePhoto,
      displayName: receiver.displayName,
      bio: receiver.bio || '',
      timeStamp: '' + new Date(),
    });
    this.db.list(`chats/${receiver.uid}/${sender.uid}/messages`).push({
      message: message,
      sentBy: sender.uid,
      timeStamp: '' + new Date(),
    });
    this.db.object(`displayChats/${receiver.uid}/${sender.uid}`).update({
      message: message,
      sentBy: sender.uid,
      userName: sender.userName,
      profilePhoto: sender.profilePhoto,
      thumbnail: sender.thumbnail || sender.profilePhoto,
      displayName: sender.displayName,
      bio: sender.bio || '',
      timeStamp: '' + new Date(),
    });
  }

  deleteMessage(senderId, receiverId, messageId) {
    this.db.list(`chats/${senderId}/${receiverId}/messages/${messageId}`).remove();
    this.db.list(`chats/${receiverId}/${senderId}/messages/${messageId}`).remove();
  }

  deleteAllMessages(senderId, receiverId) {
    this.db.list(`chats/${senderId}/${receiverId}/messages`).remove();
    this.db.list(`displayChats/${senderId}/${receiverId}`).remove();
  }

  getDisplayMessages(senderId) {
    return this.db
      .list(`displayChats/${senderId}`, ref => ref.orderByChild('timeStamp'))
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() }))));
  }

  getMessages(senderId, receiverId) {
    return this.db
      .list(`chats/${senderId}/${receiverId}/messages`)
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => ({ key: a.key, ...a.payload.val() }))));
  }
}
