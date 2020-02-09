import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { StorageService } from '../storage.service';
import { MenuController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ask-apikey',
  templateUrl: './ask-apikey.page.html',
  styleUrls: ['./ask-apikey.page.scss'],
})
export class AskAPIKeyPage implements OnInit {

  private apiKey: string;

  constructor(public api: ApiService, public storage: StorageService, public menuCtrl: MenuController, public alertController: AlertController, public router: Router) {
    this.apiKey = '';
  }

  ngOnInit() {
  }

  subscribe() {
    this.api.apiKey = this.apiKey;
    this.api.getProfile().then((value) => {
      console.log(value);
      if ("created" in value) {
        this.storage.setAPIKey(this.apiKey).then((val) => {
          this.router.navigateByUrl('/home');
        });
        // this.router.navigateByUrl('home');
      } else {
        this.displayWrongKey();
      }
    })
  }

  signIn() {
    window.open('https://shodan.io', '_self')
  }

  async displayWrongKey() {      
    const alert = await this.alertController.create({
      header: 'Oops.',
      message: 'It seems that your API key is invalid.',
      buttons: [
        {
          text: 'Ok.',
          handler: (data) => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
    this.storage.getAPIKey().then((val) => {
      if (val) {
        this.router.navigateByUrl('/home');
      }
    })
  }
}
