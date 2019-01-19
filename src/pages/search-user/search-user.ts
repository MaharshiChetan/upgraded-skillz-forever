import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'search-user-page',
  templateUrl: 'search-user.html',
})
export class SearchUserPage {
  constructor(public navCtrl: NavController, public navParams: NavParams) {}
}
