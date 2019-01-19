import { LoadingController } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class LoadingService {
  loading: any;
  constructor(private loadingCtrl: LoadingController) {}

  show(content?: any) {
    this.loading = this.loadingCtrl.create({
      content: content || 'Please wait...',
      dismissOnPageChange: true,
    });
    this.loading.present();
  }

  hide() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }
}
