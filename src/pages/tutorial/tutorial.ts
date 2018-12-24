import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'tutorial-page',
  templateUrl: 'tutorial.html',
})
export class TutorialPage {
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad TutorialPage');
  }

  pay() {
    var options = {
      description: 'Credits towards consultation',
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR',
      key: 'rzp_test_1DP5mmOlF5G5ag',
      amount: '5000',
      name: '5 Elementz',
      prefill: {
        email: 'ankushchaudhary@gmail.com',
        contact: '9769256425',
        name: 'Ankush Chaudhary',
      },
      external: {
        wallets: ['paytm'],
      },
      theme: {
        color: '#F37254',
      },
    };

    var successCallback = function(success) {
      alert('payment_id: ' + success.razorpay_payment_id);
      var orderId = success.razorpay_order_id;
      var signature = success.razorpay_signature;
    };

    var cancelCallback = function(error) {
      alert(error.description + ' (Error ' + error.code + ')');
    };

    RazorpayCheckout.on('payment.success', successCallback);
    RazorpayCheckout.on('payment.cancel', cancelCallback);
    RazorpayCheckout.open(options);
  }
}
