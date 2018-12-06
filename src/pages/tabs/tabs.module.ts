import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsPage } from './tabs';
import { SharedModule } from '../../app/shared.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [TabsPage],
  imports: [IonicPageModule.forChild(TabsPage), SharedModule, ComponentsModule],
})
export class TabsPageModule {}
