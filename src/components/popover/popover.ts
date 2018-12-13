import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  selector: 'popover',
  templateUrl: 'popover.html',
})
export class PopoverComponent {
  currentUserOptions = [
    { name: 'Leaderboard' },
    { name: 'Invite Friends' },
    { name: 'Share' },
    { name: 'My Events' },
    { name: 'My Tutorials' },
    { name: 'Edit Profile' },
    { name: 'Settings' },
  ];
  otherUserOptions = [
    { name: 'Drop' },
    { name: 'Message' },
    { name: 'Share' },
    { name: 'Report' },
    { name: 'Block' },
  ];

  type = '';
  constructor(private viewCtrl: ViewController, private navParams: NavParams) {
    this.type = this.navParams.get('type');
  }

  optionSelected(option) {
    this.viewCtrl.dismiss(option);
  }
}
