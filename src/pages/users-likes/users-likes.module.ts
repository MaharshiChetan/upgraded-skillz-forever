import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsersLikesPage } from './users-likes';
import { ComponentsModule } from '../../components/components.module';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';

@NgModule({
  declarations: [UsersLikesPage],
  imports: [
    IonicPageModule.forChild(UsersLikesPage),
    ComponentsModule,
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset,
    }),
  ],
})
export class UsersLikesPageModule {}
