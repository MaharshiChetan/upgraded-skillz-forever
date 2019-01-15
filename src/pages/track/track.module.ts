import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackPage } from './track';
import { ComponentsModule } from '../../components/components.module';
import {
  IonicAudioModule,
  WebAudioProvider,
  CordovaMediaProvider,
  defaultAudioProviderFactory,
} from 'ionic-audio';

export function myCustomAudioProviderFactory() {
  return window.hasOwnProperty('cordova') ? new CordovaMediaProvider() : new WebAudioProvider();
}

@NgModule({
  declarations: [TrackPage],
  imports: [
    IonicPageModule.forChild(TrackPage),
    ComponentsModule,
    IonicAudioModule.forRoot(defaultAudioProviderFactory),
  ],
})
export class TrackPageModule {}
