import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ImageViewerController } from 'ionic-img-viewer';

@IonicPage()
@Component({
  selector: 'collections-page',
  templateUrl: 'collections.html',
})
export class CollectionsPage {
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private imageViewerCtrl: ImageViewerController
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CollectionsPage');
  }

  presentImage(myImage) {
    const imageViewer = this.imageViewerCtrl.create(myImage);
    imageViewer.present();
  }
}
