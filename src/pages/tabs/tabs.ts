import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'tabs-page',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  navbarTitle: string = 'Activity Feed';
  // titles = ['Tutorials', 'Play', 'Activity Feed', 'Events', 'Chats'];
  titles = ['Events', 'Activity Feed', 'Chats'];
  hide = false;
  constructor() {}

  ionViewDidLoad() {}

  onTabSelect(event: any) {
    this.navbarTitle = this.titles[event.index];
  }

  hideFabButton() {
    this.hide = true;
  }

  showFabButton() {
    this.hide = false;
  }
}
