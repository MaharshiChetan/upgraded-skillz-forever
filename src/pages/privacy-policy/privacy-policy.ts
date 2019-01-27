import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'privacy-policy-page',
  templateUrl: 'privacy-policy.html',
})
export class PrivacyPolicyPage {
  constructor(private view: ViewController) {}

  dismiss() {
    this.view.dismiss();
  }
}
