import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TutorialPage } from './tutorial';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [TutorialPage],
  imports: [IonicPageModule.forChild(TutorialPage), ComponentsModule],
})
export class TutorialPageModule {}
