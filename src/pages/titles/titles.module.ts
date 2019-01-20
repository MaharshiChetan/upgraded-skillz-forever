import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TitlesPage } from './titles';
import { TooltipsModule } from 'ionic-tooltips';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';

@NgModule({
  declarations: [TitlesPage],
  imports: [
    IonicPageModule.forChild(TitlesPage),
    TooltipsModule,
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset,
    }),
  ],
})
export class TitlesPageModule {}
