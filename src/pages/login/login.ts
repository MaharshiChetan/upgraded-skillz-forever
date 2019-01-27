import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth';
import { LoadingService } from '../../services/loading-service';

@IonicPage()
@Component({
  selector: 'login-page',
  templateUrl: 'login.html',
})
export class LoginPage {
  login: FormGroup;
  email: any;
  password: any;
  constructor(
    private loadingService: LoadingService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private authService: AuthService
  ) {
    this.createForm();
  }

  createForm() {
    this.login = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  loginWithEmail() {
    this.loadingService.show('Logging In');
    this.authService
      .loginwithEmail(this.email.trim(), this.password)
      .then(res => {
        this.loadingService.hide();
        if (res === true) {
          this.navCtrl.setRoot('TabsPage');
        } else if (res === 'verify') {
          this.toastCtrl
            .create({
              message: 'Verify your email before logging in',
              position: 'top',
              duration: 2000,
              cssClass: 'fail-toast',
            })
            .present();
        } else if (res === 'password') {
          this.toastCtrl
            .create({
              message: 'Please check login details',
              position: 'top',
              duration: 2000,
              cssClass: 'fail-toast',
            })
            .present();
        } else {
          this.toastCtrl
            .create({
              message: 'There was an error. Please try again',
              position: 'top',
              duration: 2000,
              cssClass: 'fail-toast',
            })
            .present();
        }
      })
      .catch(err => {
        this.loadingService.hide();
        this.toastCtrl
          .create({
            message: 'There was an error. Please try again',
            position: 'top',
            duration: 2000,
            cssClass: 'fail-toast',
          })
          .present();
      });
  }

  // doGoogleLogout(){
  //   let env = this;

  //   this.googleLoginService.doGoogleLogout()
  //   .then(function(res) {
  //     env.user = new GoogleUserModel();
  //   }, function(error){
  //     console.log("Google logout error", error);
  //   });
  // }

  // doGoogleLogin() {
  //   let env = this;

  //   this.googleLoginService.doGoogleLogin()
  //   .then(function(user){
  //     env.user = user;
  //   }, function(err){
  //     console.log("Google Login error", err);
  //   });
  // }

  googleLogin() {
    this.loadingService.show('Logging In');
    this.authService
      .registerWithGoogle()
      .then(res => {
        if (res === true) {
          this.loadingService.hide();
          this.navCtrl.setRoot('TabsPage');
        } else if (res === 'email') {
          this.loadingService.hide();
          this.toastCtrl
            .create({
              message: 'This Email Already Exists',
              position: 'top',
              duration: 2000,
              cssClass: 'fail-toast',
            })
            .present();
        } else {
          this.loadingService.hide();
          this.toastCtrl
            .create({
              message: 'Please Try Again',
              position: 'top',
              duration: 2000,
              cssClass: 'fail-toast',
            })
            .present();
        }
      })
      .catch(err => {
        this.loadingService.hide();
        this.toastCtrl
          .create({
            message: 'There was an error. Please try again',
            position: 'top',
            duration: 2000,
            cssClass: 'fail-toast',
          })
          .present();
        console.error(err);
      });
  }

  facebookLogin() {
    this.loadingService.show('Logging In');
    this.authService
      .registerWithFacebook()
      .then(res => {
        if (res === true) {
          this.loadingService.hide();
          this.navCtrl.setRoot('TabsPage');
        } else if (res === 'email') {
          this.loadingService.hide();
          this.toastCtrl
            .create({
              message: 'This Email Already Exists',
              position: 'top',
              duration: 2000,
              cssClass: 'fail-toast',
            })
            .present();
        } else {
          this.loadingService.hide();
          this.toastCtrl
            .create({
              message: 'Please Try Again',
              position: 'top',
              duration: 2000,
              cssClass: 'fail-toast',
            })
            .present();
        }
      })
      .catch(err => {
        this.loadingService.hide();
        this.toastCtrl
          .create({
            message: 'There was an error. Please try again',
            position: 'top',
            duration: 2000,
            cssClass: 'fail-toast',
          })
          .present();
        console.error(err);
      });
  }
  goToSignup() {
    this.navCtrl.push('RegisterPage');
  }
}
