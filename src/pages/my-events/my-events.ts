import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { EventsService } from '../../providers/events/events';
import firebase from 'firebase';
import { PostService } from '../../providers/post/post';
import { LoadingService } from '../../services/loading-service';

@IonicPage()
@Component({
  selector: 'my-events-page',
  templateUrl: 'my-events.html',
})
export class MyEventsPage implements OnInit {
  events: any;
  subscription: any;

  constructor(
    private eventService: EventsService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private postService: PostService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
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
