import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { AuthService } from '../providers/auth/auth';
import { HttpClientModule } from '@angular/common/http';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';
import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { CameraService } from '../providers/camera/camera';
import { Camera } from '@ionic-native/camera';
import { SocialSharing } from '@ionic-native/social-sharing';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { EventsService } from '../providers/events/events';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { config } from './app.firebase';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

import { MessageService } from '../providers/message/message';
import { FollowService } from '../providers/follow/follow';
import { PostService } from '../providers/post/post';
import { ImageLoaderConfig } from 'ionic-image-loader';
import { ChatService } from '../providers/chat/chat';
import { Clipboard } from '@ionic-native/clipboard';
import { Keyboard } from '@ionic-native/keyboard';
import { DataService } from '../providers/data/data';

import {
  IonicAudioModule,
  WebAudioProvider,
  CordovaMediaProvider,
  defaultAudioProviderFactory,
} from 'ionic-audio';

import { PopoverComponent } from '../components/popover/popover';
import { HeaderColor } from '@ionic-native/header-color';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { TitlesService } from '../providers/titles/titles';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserPostService } from '../providers/user-post/user-post';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';
import { LoadingService } from '../services/loading-service';
import { PostLikesService } from '../providers/post-likes/post-likes';
import { PostCommentsService } from '../providers/post-comments/post-comments';
import { Crop } from '@ionic-native/crop';
import { Base64 } from '@ionic-native/base64';
import { ToastService } from '../services/toast-service';

export function myCustomAudioProviderFactory() {
  return window.hasOwnProperty('cordova') ? new CordovaMediaProvider() : new WebAudioProvider();
}

@NgModule({
  declarations: [MyApp, PopoverComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(config),
    IonicAudioModule.forRoot(defaultAudioProviderFactory),
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true,
      // animate: false,
      mode: 'ios',
      platforms: {
        ios: {
          pageTransition: 'ios-transition',
        },
        android: {
          pageTransition: 'wp-transition',
        },
      },
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
  entryComponents: [MyApp, PopoverComponent],
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

    AuthService,
    CameraService,
    EventsService,
    MessageService,
    FollowService,
    PostService,
    TitlesService,
    ImageLoaderConfig,
    ChatService,
    Clipboard,
    DataService,
    UserPostService,

    LoadingService,
    PostLikesService,
    PostCommentsService,
    ToastService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
