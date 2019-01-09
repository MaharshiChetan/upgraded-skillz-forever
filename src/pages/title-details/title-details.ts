import { Component, OnInit } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'title-details-page',
  templateUrl: 'title-details.html',
})
export class TitleDetailsPage implements OnInit {
  title: any;
  showMore: boolean = false;

  constructor(private navParams: NavParams) {}

  ngOnInit() {
    this.title = this.navParams.get('title').title;
  }

  changeContentLength() {
    this.showMore = !this.showMore;
  }
}
