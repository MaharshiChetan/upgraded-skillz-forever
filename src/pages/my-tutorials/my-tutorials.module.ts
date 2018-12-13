import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyTutorialsPage } from './my-tutorials';

@NgModule({
  declarations: [
    MyTutorialsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyTutorialsPage),
  ],
})
export class MyTutorialsPageModule {}
