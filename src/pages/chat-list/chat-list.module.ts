import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatListPage } from './chat-list';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [ChatListPage],
  imports: [IonicPageModule.forChild(ChatListPage), ComponentsModule],
})
export class ChatListPageModule {}
