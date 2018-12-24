import { Component } from '@angular/core';
import { NavController, IonicPage, App } from 'ionic-angular';
import { EventsProvider } from '../../providers/events/events';
import { TabsPage } from '../tabs/tabs';
import { DataProvider } from '../../providers/data/data';

@IonicPage()
@Component({
  selector: 'events-page',
  templateUrl: 'events.html',
})
export class EventsPage {
  events: any[];
  subscription: any;
  animate: boolean = true;
  loaded;
  searchTerm: string;
  searchEvents: any[];
  placeholderImage = 'assets/placeholder.jpg';
  constructor(
    public navCtrl: NavController,
    private eventService: EventsProvider,
    private dataService: DataProvider,
    private tabsPage: TabsPage,
    private app: App
  ) {}

  ionViewWillEnter() {
    this.tabsPage.showFabButton();
    this.fetchEvents(null);
  }

  ionViewDidLeave() {
    this.animate = false;
  }

  fetchEvents(refresher) {
    this.subscription = this.eventService.fetchEvents().subscribe(events => {
      this.events = events;
      this.searchEvents = this.events;
      if (refresher) refresher.complete();
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  goToEventDetails(event) {
    this.app.getRootNav().push('EventDetailsPage', { event: event });
    this.tabsPage.hideFabButton();
  }

  share(card) {
    alert(card.title + ' was shared.');
  }

  goToCreateEventPage() {
    this.app.getRootNav().push('CreateEventPage');
  }

  setFilteredItems(event) {
    this.events = this.dataService.filterEvents(this.searchEvents, this.searchTerm);
  }
}
