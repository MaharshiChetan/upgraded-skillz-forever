import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController } from 'ionic-angular';
import { EventsProvider } from '../../providers/events/events';
import firebase from 'firebase';
import { PostProvider } from '../../providers/post/post';
import { LoadingService } from '../../services/loading-service';

@IonicPage()
@Component({
  selector: 'my-events-page',
  templateUrl: 'my-events.html',
})
export class MyEventsPage {
  events: any;
  subscription: any;

  constructor(
    private eventService: EventsProvider,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private postService: PostProvider,
    private loadingService: LoadingService
  ) {}

  ionViewWillEnter() {
    this.getMyEvents(null);
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  getMyEvents(refresher) {
    this.subscription = this.eventService.fetchEvents().subscribe(events => {
      let tempEvents: any = events;
      this.events = tempEvents.filter(event => {
        return firebase.auth().currentUser.uid == event.uid;
      });

      if (refresher) refresher.complete();
    });
  }

  goToCreateEventPage(event) {
    this.navCtrl.push('CreateEventPage', { eventData: event });
  }

  deleteEvent(event) {
    try {
      const eventInfo = {
        imageId: event.imageId,
        key: event.key,
      };
      let alertPopup = this.alertCtrl.create({
        title: 'Are you sure?',
        message: 'This event will be permanently deleted.',
        buttons: [
          {
            text: 'Delete',
            handler: () => {
              alertPopup.dismiss().then(() => {
                this.loadingService.show('Deleting event...');
                this.postService.deleteAllLikes(eventInfo.key);
                this.postService.deleteAllPost(eventInfo.key);
                this.eventService.deleteEvent(eventInfo);
                this.loadingService.hide();
              });
              return false;
            },
          },
          {
            text: 'Cancel',
            handler: () => {},
          },
        ],
      });
      alertPopup.present();
      return false;
    } catch (e) {
      console.log(e);
    }
  }

  goToTrackEventPage(event) {}
}
