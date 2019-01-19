import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'privacy-policy-page',
  templateUrl: 'privacy-policy.html',
})
export class PrivacyPolicyPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private view: ViewController
  ) {}

  dismiss() {
    this.view.dismiss();
  }
}
