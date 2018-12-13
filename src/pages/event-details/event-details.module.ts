import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventDetailsPage } from './event-details';
import { HideFabOnscrollModule } from 'ionic-hide-fab-onscroll';
import { MomentModule } from 'ngx-moment';
import { ComponentsModule } from '../../components/components.module';
import { ElasticHeaderModule } from 'ionic2-elastic-header/dist/';

@NgModule({
  declarations: [EventDetailsPage],
  imports: [
    HideFabOnscrollModule,
    MomentModule,
    ComponentsModule,
    ElasticHeaderModule,
    IonicPageModule.forChild(EventDetailsPage),
  ],
})
export class EventDetailsPageModule {}
