import { Component, Input } from '@angular/core';
import { App } from 'ionic-angular';

@Component({
  selector: 'thumbnail-post',
  templateUrl: 'thumbnail-post.html',
})
export class ThumbnailPostComponent {
  @Input('posts') posts: any;
  grayPlaceholder: string = 'assets/gray-placeholder.png';

  constructor(private app: App) {}
  showPost(post: any) {
    this.app.getRootNav().push('PostPage', { post: post });
  }
}
