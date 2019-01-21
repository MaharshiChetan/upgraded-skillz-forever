import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { AuthProvider } from '../providers/auth/auth';
import { HttpClientModule } from '@angular/common/http';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';
import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { CameraProvider } from '../providers/camera/camera';
import { Camera } from '@ionic-native/camera';
import { SocialSharing } from '@ionic-native/social-sharing';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { EventsProvider } from '../providers/events/events';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { config } from './app.firebase';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

import { Message } from '../providers/message/message';
import { FollowProvider } from '../providers/follow/follow';
import { PostProvider } from '../providers/post/post';
import { ImageLoaderConfig } from 'ionic-image-loader';
import { ChatProvider } from '../providers/chat/chat';
import { Clipboard } from '@ionic-native/clipboard';
import { Keyboard } from '@ionic-native/keyboard';
import { DataProvider } from '../providers/data/data';

import {
  IonicAudioModule,
  WebAudioProvider,
  CordovaMediaProvider,
  defaultAudioProviderFactory,
} from 'ionic-audio';

import { PopoverComponent } from '../components/popover/popover';
import { HeaderColor } from '@ionic-native/header-color';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { TitlesProvider } from '../providers/titles/titles';
import { NewPopoverComponent } from '../components/new-popover/new-popover';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserPostProvider } from '../providers/user-post/user-post';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';
import { LoadingService } from '../services/loading-service';
import { PostLikesProvider } from '../providers/post-likes/post-likes';
import { PostCommentsProvider } from '../providers/post-comments/post-comments';
import { Crop } from '@ionic-native/crop';
import { Base64 } from '@ionic-native/base64';

export function myCustomAudioProviderFactory() {
  return window.hasOwnProperty('cordova') ? new CordovaMediaProvider() : new WebAudioProvider();
}

@NgModule({
  declarations: [MyApp, PopoverComponent, NewPopoverComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(config),
    IonicAudioModule.forRoot(defaultAudioProviderFactory),
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true,
      // animate: false,
      pageTransition: 'wp-transition',
      mode: 'ios',
      ios: {
        scrollAssist: false,
        autoFocusAssist: false,
        inputBlurring: false,
      },
    }),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    IonicImageViewerModule,
    SuperTabsModule.forRoot(),
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset,
    }),
    BrowserAnimationsModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, PopoverComponent, NewPopoverComponent],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    GooglePlus,
    Facebook,
    Network,
    Camera,
    SocialSharing,
    InAppBrowser,
    FileTransfer,
    File,
    HeaderColor,
    Crop,
    Base64,
    Keyboard,

    AuthProvider,
    CameraProvider,
    EventsProvider,
    Message,
    FollowProvider,
    PostProvider,
    TitlesProvider,
    ImageLoaderConfig,
    ChatProvider,
    Clipboard,
    DataProvider,
    UserPostProvider,

    LoadingService,
    PostLikesProvider,
    PostCommentsProvider,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
