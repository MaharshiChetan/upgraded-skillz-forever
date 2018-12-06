import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'new-popover',
  templateUrl: 'new-popover.html',
})
export class NewPopoverComponent {
  options = [
    { name: 'Leaderboard', id: 1 },
    { name: 'Invite Friends', id: 2 },
    { name: 'Share', id: 3 },
    { name: 'Rate', id: 4 },
    { name: 'Feedback', id: 5 },
    { name: 'Settings', id: 6 },
  ];

  constructor(private viewCtrl: ViewController) {}

  optionSelected(option) {
    this.viewCtrl.dismiss(option);
  }
}
