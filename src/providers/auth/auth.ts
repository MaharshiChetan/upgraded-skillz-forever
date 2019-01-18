import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Platform } from 'ionic-angular';

@Injectable()
export class AuthProvider {
  uid: any = null;
  query: any;
  usersdata = firebase.database().ref('/users');
  public currentUserDetails: any;
  public userDetails: any;
  constructor(
    public http: HttpClient,
    private googlePlus: GooglePlus,
    private storage: Storage,
    private platform: Platform,
    private facebook: Facebook,
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase
  ) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.uid = user.uid;
        this.getCurrentUserDetails().subscribe(data => {
          this.currentUserDetails = data;
        });
        this.updateOnConnect();
        this.updateOnDisconnect();
        this.updateOnAway();
      }
    });
  }

  checkUsername(username: string) {
    return firebase.database().ref(`usernames/${username}`);
  }

  removeUsername(username: string) {
    return firebase
      .database()
      .ref(`usernames/${username}`)
      .remove();
  }

  updateUsername(username: string, uid: string, email: string) {
    return firebase
      .database()
      .ref(`usernames`)
      .child(`${username}`)
      .update({ uid: uid, email: email });
  }

  registerWithEmail(email: string, password: string, name: string, username: string) {
    return new Promise(resolve => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(response => {
          firebase
            .auth()
            .currentUser.sendEmailVerification()
            .then(() => {
              this.updateUsername(username, response.user.uid, email)
                .then(() => {
                  this.updateUser(
                    response.user.uid,
                    name,
                    username,
                    'https://profile.actionsprout.com/default.jpeg',
                    '',
                    email
                  )
                    .then(res => {
                      if (res === true) {
                        this.loginwithEmail(email, password)
                          .then(res => {
                            if (res === true) {
                              resolve(true);
                            } else if (res === 'verify') {
                              resolve('verify');
                            } else if (res === 'password') {
                              resolve('password');
                            } else {
                              resolve(false);
                            }
                          })
                          .catch(err => {
                            resolve(false);
                            console.error(err);
                          });
                      } else {
                        this.deleteAccount()
                          .then(res => {
                            resolve(false);
                          })
                          .catch(err => {
                            console.error(err);
                          });
                      }
                    })
                    .catch(err => {
                      console.error(err);
                      this.deleteAccount()
                        .then(res => {
                          resolve(false);
                        })
                        .catch(err => {
                          console.error(err);
                        });
                    });
                })
                .catch(err => {
                  console.error(err);
                  this.deleteAccount()
                    .then(res => {
                      resolve(false);
                    })
                    .catch(err => {
                      console.error(err);
                    });
                });
            })
            .catch(err => {
              console.error(err);
              resolve('email');
            });
        })
        .catch(err => {
          console.error(err);
          resolve('email');
        });
    });
  }

  loginwithEmail(email, password) {
    return new Promise(resolve => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(response => {
          let userdata = JSON.parse(JSON.stringify(response));

          if (userdata.user.emailVerified === true) {
            this.setLoginKey(userdata.user.uid)
              .then(res => {
                resolve(true);
              })
              .catch(err => {
                console.error(err);
                resolve(false);
              });
          } else {
            resolve('verify');
          }
        })
        .catch(err => {
          if (err.code === 'auth/wrong-password') {
            resolve('password');
          } else {
            resolve(false);
          }
        });
    });
  }

  registerWithGoogle() {
    return new Promise(resolve => {
      this.googlePlus
        .login({
          webClientId: '766344988044-rq4ldcpfb22dggipn58a03te59nhen25.apps.googleusercontent.com',
          offline: true,
        })
        .then(res => {
          const googleCredential = firebase.auth.GoogleAuthProvider.credential(
            null,
            res.accessToken
          );
          firebase
            .auth()
            .signInWithCredential(googleCredential)
            .then(response => {
              let userdata = JSON.parse(JSON.stringify(response));
              this.updateUser(
                userdata.uid,
                userdata.displayName,
                userdata.email.substring(0, userdata.email.lastIndexOf('@')),
                userdata.photoURL,
                '',
                userdata.email
              )
                .then(res => {
                  if (res === true) {
                    this.setLoginKey(userdata.uid)
                      .then(res => {
                        resolve(true);
                      })
                      .catch(err => {
                        console.error('There is an error setting login key' + err);
                        this.deleteAccount()
                          .then(res => {
                            resolve(false);
                          })
                          .catch(err => {
                            console.error(err);
                          });
                      });
                  } else {
                    this.deleteAccount()
                      .then(res => {
                        resolve(false);
                      })
                      .catch(err => {
                        console.error(err);
                      });
                  }
                })
                .catch(err => {
                  console.error(err);
                  this.deleteAccount()
                    .then(res => {
                      resolve(false);
                    })
                    .catch(err => {
                      console.error(err);
                    });
                });
            })
            .catch(err => {
              console.error(err);
              resolve('email');
            });
        })
        .catch(err => {
          console.error(err);
          resolve(false);
        });
    });
  }

  registerWithFacebook() {
    return new Promise(resolve => {
      this.facebook
        .login(['public_profile', 'user_friends', 'email'])
        .then(response => {
          const facebookCredential = firebase.auth.FacebookAuthProvider.credential(
            response.authResponse.accessToken
          );
          firebase
            .auth()
            .signInWithCredential(facebookCredential)
            .then(response => {
              let userdata = JSON.parse(JSON.stringify(response));
              this.updateUser(
                userdata.uid,
                userdata.displayName,
                'NOUSERNAME',
                userdata.photoURL,
                '',
                ''
              )
                .then(res => {
                  if (res === true) {
                    this.setLoginKey(userdata.uid)
                      .then(res => {
                        resolve(true);
                      })
                      .catch(err => {
                        console.error('There is an error setting login key' + err);
                        this.deleteAccount()
                          .then(res => {
                            resolve(false);
                          })
                          .catch(err => {
                            console.error(err);
                          });
                      });
                  } else {
                    this.deleteAccount()
                      .then(res => {
                        resolve(false);
                      })
                      .catch(err => {
                        console.error(err);
                      });
                  }
                })
                .catch(err => {
                  console.error(err);
                  this.deleteAccount()
                    .then(res => {
                      resolve(false);
                    })
                    .catch(err => {
                      console.error(err);
                    });
                });
            })
            .catch(err => {
              resolve('email');
              console.error(err);
            });
        })
        .catch(err => {
          resolve(false);
          console.error(err);
        });
    });
  }

  setLoginKey(uid) {
    return new Promise(resolve => {
      this.storage
        .set('user', uid)
        .then(res => {
          resolve(true);
        })
        .catch(err => {
          console.error(err);
          resolve(false);
        });
    });
  }

  logout() {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signOut()
        .catch(err => {
          console.error(err);
        });
      this.storage.remove('user');
      this.googlePlus.logout().catch(err => {
        console.error(err);
      });
      this.facebook.logout().catch(err => {
        console.error(err);
      });
    });
  }

  updateUser(
    uid,
    name,
    username,
    profilePhoto,
    bio: string,
    email: string,
    google: boolean = false
  ) {
    return new Promise(resolve => {
      this.updateUsername(username, uid, email).then(() => {
        firebase
          .auth()
          .currentUser.updateProfile({
            displayName: name,
            photoURL: profilePhoto,
          })
          .then(res => {
            if (google) {
              this.usersdata
                .child(firebase.auth().currentUser.uid)
                .child('personalData')
                .once('value', snapshot => {
                  if (!snapshot.val()) {
                    this.usersdata
                      .child(firebase.auth().currentUser.uid)
                      .child('personalData')
                      .update({
                        uid: firebase.auth().currentUser.uid,
                        displayName: name,
                        email: email,
                        userName: username,
                        bio: bio || '',
                        profilePhoto: profilePhoto,
                      })
                      .then(res => {
                        resolve(true);
                      })
                      .catch(err => {
                        console.error(err);
                        resolve(false);
                      });
                  } else {
                    resolve(true);
                  }
                })
                .catch(e => {
                  resolve(false);
                });
            } else {
              this.usersdata
                .child(firebase.auth().currentUser.uid)
                .child('personalData')
                .update({
                  uid: firebase.auth().currentUser.uid,
                  displayName: name,
                  email: email,
                  userName: username,
                  bio: bio || '',
                  profilePhoto: profilePhoto,
                })
                .then(res => {
                  resolve(true);
                })
                .catch(err => {
                  console.error(err);
                  resolve(false);
                });
            }
          })
          .catch(err => {
            console.error(err);
            resolve(false);
          });
      });
    });
  }

  getUserDetails() {
    return new Promise(resolve => {
      this.storage
        .get('user')
        .then(res => {
          this.usersdata
            .child(`${res}/personalData`)
            .once('value', snapshot => {
              resolve(snapshot.toJSON());
            })
            .catch(err => {
              console.error(err);
            });
        })
        .catch(err => {
          console.error(err);
        });
    });
  }

  getCurrentUserDetails() {
    return this.db.object(`users/${this.uid}/personalData`).valueChanges();
  }

  deleteAccount() {
    return new Promise(resolve => {
      firebase
        .auth()
        .currentUser.delete()
        .then(res => {
          resolve(true);
        })
        .catch(err => {
          resolve(false);
          console.error(err);
        });
    });
  }

  incrementUserEventParticipation(eventKey, type) {
    this.usersdata.child(`events/${type}/${eventKey}`).set({
      eventKey: eventKey,
    });
  }

  decrementUserEventParticipation(eventKey, type) {
    this.usersdata.child(`events/${type}/${eventKey}`).remove();
  }

  getActiveUser() {
    return firebase.auth().currentUser;
  }

  private updateStatus(status: string) {
    if (!this.uid) return;

    this.db.object(`users/${this.uid}/personalData`).update({ status: status });
  }

  /// Updates status when connection to Firebase starts
  private updateOnConnect() {
    this.updateStatus('online');
  }

  updateOnAway() {
    this.platform.resume.subscribe(result => {
      this.updateStatus('online');
    });
    this.platform.pause.subscribe(result => {
      this.updateStatus('away');
    });
  }

  /// Updates status when connection to Firebase ends
  private updateOnDisconnect() {
    firebase
      .database()
      .ref()
      .child(`users/${this.uid}/personalData`)
      .onDisconnect()
      .update({ status: 'offline' });
  }
}
