import { Component, OnInit } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  selector: 'popover',
  templateUrl: 'popover.html',
})
export class PopoverComponent implements OnInit {
  options: any;
  constructor(private viewCtrl: ViewController, private navParams: NavParams) {}

  ngOnInit() {
    this.options = this.navParams.get('popoverOptions');
  }

  optionSelected(option: any) {
    this.viewCtrl.dismiss(option);
  }
}
