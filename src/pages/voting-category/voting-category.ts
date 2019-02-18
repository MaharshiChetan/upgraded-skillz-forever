import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'voting-category-page',
  templateUrl: 'voting-category.html',
})
export class VotingCategoryPage implements OnInit {
  event: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ngOnInit() {
    this.event = this.navParams.get('event');
    console.log(this.event);
  }

  goToVotingZone() {
    this.navCtrl.push('VotingZonePage');
  }
}
