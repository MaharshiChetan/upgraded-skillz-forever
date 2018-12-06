import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'track-page',
  templateUrl: 'track.html',
})
export class TrackPage {
  constructor() {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad TrackPage');
  }
}
