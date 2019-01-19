import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'activity-page',
  templateUrl: 'activity.html',
})
export class ActivityPage {
  constructor(public navCtrl: NavController, public navParams: NavParams) {}
}
