import { Component, OnInit } from '@angular/core';
import { IonicPage, App } from 'ionic-angular';
import { EventsService } from '../../providers/events/events';
import { TabsPage } from '../tabs/tabs';
import { DataService } from '../../providers/data/data';
import { LoadingService } from '../../services/loading-service';

@IonicPage()
@Component({
  selector: 'events-page',
  templateUrl: 'events.html',
})
export class EventsPage implements OnInit {
  events: any[];
  searchTerm: string;
  searchEvents: any[];
  placeholderImage = 'assets/placeholder.jpg';
  constructor(
    private eventService: EventsService,
    private dataService: DataService,
    private tabsPage: TabsPage,
    private app: App,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.tabsPage.showFabButton();
    this.fetchEvents(null);
  }

  fetchEvents(refresher) {
    const subscription = this.eventService.fetchEvents().subscribe(events => {
      this.events = events;
      this.searchEvents = this.events;
      subscription.unsubscribe();
      if (refresher) refresher.complete();
    });
  }

  goToEventDetails(event: any) {
    this.loadingService.show();
    this.app.getRootNav().push('EventDetailsPage', { event: event });
    this.tabsPage.hideFabButton();
  }

  share(card) {
    alert(card.title + ' was shared.');
  }

  goToCreateEventPage() {
    this.loadingService.show();
    this.app.getRootNav().push('CreateEventPage');
  }

  setFilteredItems(event) {
    this.events = this.dataService.filterEvents(this.searchEvents, this.searchTerm);
  }
}
