import { Component } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { IonicPage, NavController, ToastController, ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth';
import { LoadingService } from '../../services/loading-service';

@IonicPage()
@Component({
  selector: 'register-page',
  templateUrl: 'register.html',
})
export class RegisterPage {
  register: FormGroup;
  name: string;
  username: string;
  email: string;
  password: string;
  passwordconfirm: string;

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private loadingService: LoadingService,
    private modal: ModalController
  ) {
    this.createForm();
  }

  createForm() {
    this.register = new FormGroup({
      name: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  emailRegister() {
    this.loadingService.show('Creating Account...');
    const { name, username, email } = this.trimValues();
    this.authService
      .checkUsername(username)
      .once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          this.loadingService.hide();
          this.toastCtrl
            .create({
              message: 'Username already exists!',
              position: 'top',
              duration: 2000,
              cssClass: 'fail-toast',
            })
            .present();
          return;
        } else if (name && username && email) {
          this.loadingService.show('Creating Account...');
          this.authService
            .registerWithEmail(email, this.password, name, username)
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
                this.navCtrl.setRoot('LoginPage');
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
      });
  }

  googleRegister() {
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

  facebookRegister() {
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
  goToLogin() {
    this.navCtrl.pop();
  }

  showTermsModal() {
    let modal = this.modal.create('TermsOfServicePage');
    modal.present();
  }

  showPrivacyModal() {
    let modal = this.modal.create('PrivacyPolicyPage');
    modal.present();
  }

  trimValues() {
    if (this.username && this.name && this.email) {
      return {
        name: this.name.trim(),
        username: this.username.trim(),
        email: this.email.trim(),
      };
    } else {
      return {
        name: null,
        username: null,
        email: null,
      };
    }
  }

  removeSpaceFromUsername() {
    const username = this.register.get('username').value.trim();
    this.register.get('username').setValue(username);
  }
}
