import { Component, ViewChild, OnInit } from '@angular/core';
import {
  IonicPage,
  NavParams,
  NavController,
  Content,
  FabContainer,
  AlertController,
  ActionSheetController,
} from 'ionic-angular';
import { ImageViewerController } from 'ionic-img-viewer';
import { AuthService } from '../../providers/auth/auth';
import { EventsService } from '../../providers/events/events';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { MessageService } from '../../providers/message/message';
import { Platform } from 'ionic-angular/platform/platform';
import { CameraService } from '../../providers/camera/camera';
import { PostService } from '../../providers/post/post';
import firebase from 'firebase';
import { LoadingService } from '../../services/loading-service';
import { PostLikesService } from '../../providers/post-likes/post-likes';
import { PostCommentsService } from '../../providers/post-comments/post-comments';

@IonicPage()
@Component({
  selector: 'event-details-page',
  templateUrl: 'event-details.html',
})
export class EventDetailsPage implements OnInit {
  @ViewChild(Content)
  content: Content;

  fileTransfer: FileTransferObject = this.transfer.create();
  grayPlaceholder: string = 'assets/gray-placeholder.png';
  placeHolderImage: string = 'assets/placeholder.jpg';
  start = 0;
  usersdata = firebase.database().ref('/users');
  slideHeaderPrevious = 0;
  ionScroll: any;
  showheader: boolean;
  hideheader: boolean;
  headercontent: any;
  bookingTitle: string = 'Book';
  posts: any;
  userDetails: any = [];
  event;
  interested = false;
  going = false;
  interestedSubscription;
  goingSubscription;

  interestedUsers;
  goingUsers;

  isLiking: boolean = false;
  uid = this.authService.getActiveUser().uid;

  currentUserDetails: any;
  type = 'about';

  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private imageViewerCtrl: ImageViewerController,
    private authService: AuthService,
    private eventService: EventsService,
    private socialSharing: SocialSharing,
    private transfer: FileTransfer,
    private file: File,
    private presentMessage: MessageService,
    private loadingService: LoadingService,
    private alertCtrl: AlertController,
    private cameraService: CameraService,
    private platform: Platform,
    private actionsheetCtrl: ActionSheetController,
    private postService: PostService,
    private postLikesService: PostLikesService,
    private postCommentsService: PostCommentsService
  ) {
    this.event = this.navParams.get('event');
  }

  ngOnInit() {
    this.fetchCurrentUserProfile();

    this.interestedSubscription = this.eventService
      .fetchActivePeopleForEvents(this.event.key, 'interested')
      .subscribe(users => {
        this.interestedUsers = users;

        this.checkInterest();
      });
    this.goingSubscription = this.eventService
      .fetchActivePeopleForEvents(this.event.key, 'going')
      .subscribe(users => {
        this.goingUsers = users;

        this.checkGoing();
      });
  }

  ionViewWillLeave() {
    this.interestedSubscription.unsubscribe();
    this.goingSubscription.unsubscribe();
  }

  fetchCurrentUserProfile() {
    this.authService.getUserDetails().then(user => {
      this.currentUserDetails = user;
    });
  }

  presentImage(myImage) {
    this.imageViewerCtrl.create(myImage).present();
  }

  goToReviewsPage() {
    this.navCtrl.push('ReviewsPage');
  }

  incrementInterestedOrGoing(eventKey: string, type: string) {
    try {
      this.eventService.incrementInterestedOrGoing(eventKey, this.uid, type);
      if (type === 'going') this.checkGoing();
      else this.checkInterest();
    } catch (e) {
      alert(e);
    }
  }

  decrementInterestedOrGoing(eventKey: string, type: string) {
    try {
      this.eventService.decrementInterestedOrGoing(eventKey, this.uid, type);
      if (type === 'going') this.checkGoing();
      else this.checkInterest();
    } catch (e) {
      alert(e);
    }
  }

  checkInterest() {
    this.eventService
      .isInterestedOrGoing(this.event.key, this.uid, 'interested')
      .subscribe(data => {
        this.interested = data ? true : false;
      });
  }

  checkGoing() {
    this.eventService.isInterestedOrGoing(this.event.key, this.uid, 'going').subscribe(data => {
      this.going = data ? true : false;
    });
  }

  shareOnWhatsApp(fab: FabContainer) {
    fab.close();
    this.loadingService.show(null);
    this.fileTransfer
      .download(this.event.eventImage, this.file.dataDirectory + 'this.event.eventName' + '.jpeg')
      .then(image => {
        this.loadingService.hide();
        this.socialSharing
          .shareViaWhatsApp(
            `*Event Name*:- ${this.event.eventName}\n*Event Description*:- ${
              this.event.eventDescription
            }\n`,
            image.toURL()
          )
          .then(data => {
            this.loadingService.hide();
            if (data) {
              this.incrementShare();
            }
          })
          .catch(error => {
            this.loadingService.hide();
          });
      })
      .catch(e => {
        this.loadingService.hide();
      });
  }

  shareOnInstagram(fab: FabContainer) {
    fab.close();
    this.loadingService.show(null);
    this.presentMessage.showAlert(
      'Hint!',
      'Event details are copied just paste in your instagram post.'
    );
    this.fileTransfer
      .download(this.event.eventImage, this.file.dataDirectory + 'this.event.eventName' + '.jpeg')
      .then(image => {
        this.loadingService.hide();
        this.socialSharing
          .shareViaInstagram(
            `*Event Name:-* ${this.event.eventName}\n*Event Description:-* ${
              this.event.eventDescription
            }`,
            image.toURL()
          )
          .then(data => {
            this.loadingService.hide();
            if (data) {
              this.incrementShare();
            }
          })
          .catch(error => {
            alert(error);
            this.loadingService.hide();
          });
      })
      .catch(e => {
        this.loadingService.hide();
      });
  }

  goToInterestedOrGoingUsersPage(type) {
    this.navCtrl.push('InterestedOrGoingPage', {
      interestedUsers: this.interestedUsers,
      goingUsers: this.goingUsers,
      type: type,
    });
  }

  incrementShare() {
    this.eventService.incrementShare(this.event.key, this.uid);
  }

  bookTicket() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Participation fees');

    this.event.eventCategories.forEach(category => {
      alert.addInput({
        type: 'radio',
        label: `${category.name}  -  Rs.${category.price}`,
        value: category,
      });
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        console.log(data);
      },
    });
    alert.present();
  }

  fetchDiscussionPosts() {
    this.postService.getEventPosts(this.event.key).subscribe(eventPosts => {
      this.posts = eventPosts.reverse();

      this.posts.forEach((post, i) => {
        this.usersdata.child(`${post.uid}/personalData`).once('value', snapshot => {
          this.posts[i].userDetails = snapshot.val();
          if (post.uid === firebase.auth().currentUser.uid) {
            this.posts[i].myPost = true;
          }
          this.postLikesService.getTotalLikes(post.key).subscribe(likes => {
            if (this.posts.length > 0) {
              this.posts[i].likes = likes;
              this.posts[i].totalLikes = likes.length;
            }
          });
          this.postCommentsService.getTotalComments(post.key).subscribe(comments => {
            if (this.posts.length > 0) {
              this.posts[i].totalComments = comments.length;
            }
          });
          this.postLikesService
            .checkLike(post.key, firebase.auth().currentUser.uid)
            .subscribe(data => {
              if (data.key && this.posts.length > 0) {
                this.posts[i].isLiking = true;
              } else if (this.posts.length > 0) {
                this.posts[i].isLiking = false;
              }
            });
        });
      });
    });
  }

  changePicture() {
    const actionsheet = this.actionsheetCtrl.create({
      title: 'Upload Picture',
      buttons: [
        {
          text: 'Camera',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            this.takePicture();
          },
        },
        {
          text: !this.platform.is('ios') ? 'Gallery' : 'Camera Roll',
          icon: !this.platform.is('ios') ? 'image' : null,
          handler: () => {
            this.getPicture();
          },
        },
        {
          text: 'Cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          role: 'destructive',
          handler: () => {
            console.log('the user has cancelled the interaction.');
          },
        },
      ],
    });
    return actionsheet.present();
  }

  takePicture() {
    this.loadingService.show(null);
    return this.cameraService.getPictureFromCamera(false).then(
      picture => {
        if (picture) {
          const quality = 6 < parseFloat(this.cameraService.getImageSize(picture)) ? 0.5 : 0.8;
          this.cameraService.generateFromImage(picture, quality, data => {
            const image =
              parseFloat(this.cameraService.getImageSize(picture)) >
              parseFloat(this.cameraService.getImageSize(data))
                ? data
                : picture;
            this.navCtrl.push('CreatePostPage', {
              image: image,
              eventName: this.event.eventName,
              eventId: this.event.key,
            });
          });
        }
        this.loadingService.hide();
      },
      error => {
        this.loadingService.hide();
        alert(error);
      }
    );
  }

  getPicture() {
    this.loadingService.show(null);
    return this.cameraService.getPictureFromPhotoLibrary(false).then(
      picture => {
        if (picture) {
          const quality = 6 < parseFloat(this.cameraService.getImageSize(picture)) ? 0.5 : 0.8;

          this.cameraService.generateFromImage(picture, quality, data => {
            const image =
              parseFloat(this.cameraService.getImageSize(picture)) >
              parseFloat(this.cameraService.getImageSize(data))
                ? data
                : picture;
            this.navCtrl.push('CreatePostPage', {
              image: image,
              eventName: this.event.eventName,
              eventId: this.event.key,
            });
          });
        }
        this.loadingService.hide();
      },
      error => {
        this.loadingService.hide();
        alert(error);
      }
    );
  }

  createPost() {
    let alertPopup = this.alertCtrl.create({
      title: 'Attach photo?',
      message: 'Would you like to attached one photo with your post?',
      buttons: [
        {
          text: 'Yes, attach photo',
          handler: () => {
            this.changePicture();
          },
        },
        {
          text: 'No, Just text',
          handler: () => {
            this.navCtrl.push('CreatePostPage', {
              eventName: this.event.eventName,
              eventId: this.event.key,
            });
          },
        },
      ],
    });
    alertPopup.present();
  }

  doInfinite(event) {}
}
