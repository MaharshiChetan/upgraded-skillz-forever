import { Component, OnInit } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-explore',
  templateUrl: 'explore.html',
})
export class ExplorePage implements OnInit {
  searchQuery: string = '';
  items: string[];

  constructor(private tabsPage: TabsPage) {
    this.initializeItems();
  }

  ngOnInit() {
    this.tabsPage.showFabButton();
  }

  initializeItems() {
    this.items = ['Flying Machine', 'Sonic', 'Flexx', 'Unstoppable', 'Chemical', 'Flowraw'];
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter(item => {
        return item.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    }
  }
}
