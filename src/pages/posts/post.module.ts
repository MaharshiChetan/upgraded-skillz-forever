import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostPage } from './post';
import { MomentModule } from 'ngx-moment';

@NgModule({
  declarations: [PostPage],
  imports: [IonicPageModule.forChild(PostPage), MomentModule],
})
export class PostPageModule {}
