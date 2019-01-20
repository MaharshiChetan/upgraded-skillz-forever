import { Component, OnInit } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'post-page',
  templateUrl: 'post.html',
})
export class PostPage implements OnInit {
  posts: any;
  constructor(private navParams: NavParams) {}

  ngOnInit() {
    this.posts = [this.navParams.get('post')];
  }
}
