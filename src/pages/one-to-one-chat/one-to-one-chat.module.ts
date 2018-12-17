import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OneToOneChatPage } from './one-to-one-chat';
import { MomentModule } from 'ngx-moment';
import { ComponentsModule } from '../../components/components.module';
import { ElasticModule } from 'angular2-elastic';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [OneToOneChatPage],
  imports: [
    MomentModule,
    IonicPageModule.forChild(OneToOneChatPage),
    ComponentsModule,
    ElasticModule,
    PipesModule,
  ],
})
export class OneToOneChatPageModule {}
