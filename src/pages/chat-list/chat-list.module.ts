import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatListPage } from './chat-list';
import { ComponentsModule } from '../../components/components.module';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';

@NgModule({
  declarations: [ChatListPage],
  imports: [
    IonicPageModule.forChild(ChatListPage),
    ComponentsModule,
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset,
    }),
  ],
})
export class ChatListPageModule {}
