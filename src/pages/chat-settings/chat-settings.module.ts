import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatSettingsPage } from './chat-settings';

@NgModule({
  declarations: [
    ChatSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatSettingsPage),
  ],
})
export class ChatSettingsPageModule {}
