import { Component, OnInit } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'popover',
  templateUrl: 'popover.html',
})
export class PopoverComponent {
  options = [
    { name: 'Leaderboard', id: 1 },
    { name: 'Invite Friends', id: 2 },
    { name: 'Share', id: 3 },
    { name: 'Edit Profile', id: 4 },
    { name: 'Settings', id: 5 },
  ];

  constructor(private viewCtrl: ViewController) {}

  optionSelected(option) {
    this.viewCtrl.dismiss(option);
  }
}
