import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { config } from './app.firebase';
import firebase from 'firebase';
import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';
import { HeaderColor } from '@ionic-native/header-color';
import { ToastService } from '../services/toast-service';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  rootPage: string = '';
  isAuthenticated = false;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private storage: Storage,
    private network: Network,
    private alertCtrl: AlertController,
    private toastService: ToastService,
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
        this.toastService.presentToast('Back Online', 'toastonline');
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

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
