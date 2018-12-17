import { Component } from '@angular/core';
import { Platform, ToastController, MenuController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { config } from './app.firebase';
import firebase from 'firebase';
import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';
import { Message } from '../providers/message/message';
import { HeaderColor } from '@ionic-native/header-color';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  rootPage: string = '';
  isAuthenticated = false;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public storage: Storage,
    public network: Network,
    public toastCtrl: ToastController,
    public menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private presentMessage: Message,
    private headerColor: HeaderColor
  ) {
    this.headerColor.tint('#414e53');
    //INITIALIZES FIREBASE WITH THE APP
    firebase.initializeApp(config);

    this.storage
      .get('user')
      .then(val => {
        if (val) {
          this.rootPage = 'TabsPage';
        } else {
          this.rootPage = 'LoginPage';
        }
      })
      .catch(err => {
        this.rootPage = 'LoginPage';
      });

    //KEEPS CHECKING NETWORK CONNECTIVITY AND ALERTS USER IF DISCONNECTED
    this.network.onchange().subscribe(networkChange => {
      if (networkChange.type === 'online') {
        this.presentMessage.showToast('Back Online', 'toastonline');
      } else if (networkChange.type === 'offline') {
        const alert = this.alertCtrl.create({
          title: 'Connection Failed!',
          subTitle: 'There may be a problem in your internet connection. Please try again !',
          buttons: ['OK'],
          enableBackdropDismiss: true,
        });
        alert.present();
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
