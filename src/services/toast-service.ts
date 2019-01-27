import { ToastController } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class ToastService {
  constructor(private toastCtrl: ToastController) {}

  presentToast(message: string, cssClass?: string) {
    return this.toastCtrl
      .create({
        message: message,
        position: 'top',
        duration: 2000,
        cssClass: cssClass,
      })
      .present();
  }
}
