import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'terms-of-service-page',
  templateUrl: 'terms-of-service.html',
})
export class TermsOfServicePage {
  constructor(private view: ViewController) {}

  dismiss() {
    this.view.dismiss();
  }
}
