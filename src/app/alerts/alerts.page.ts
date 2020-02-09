import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NavExtrasService } from '../nav-extras.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.page.html',
  styleUrls: ['./alerts.page.scss'],
})
export class AlertsPage implements OnInit {

  private alerts: any;
  constructor(public api: ApiService, public alertController: AlertController, public router: Router, public navExtrasService: NavExtrasService) {
    this.alerts = [];
  }

  ngOnInit() {
    this.getAlerts();
  }

  getAlerts() {
    this.api.getNetworkAlerts().then((alerts) => {
      console.log(alerts);
      this.alerts = alerts;
    })
  }


  goToDetails(alert) {
    this.navExtrasService.setItem(alert.id);
    this.router.navigateByUrl('/alerts-details');
  }

  async addAlert(item: any) {
    const alert = await this.alertController.create({
      header: 'Add a Network Alert',
      subHeader: 'Fill in the information.',
      // message: 'Are you sure you want to delete this bookmark ?',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Alert name'
        },
        {
          name: 'ip',
          type: 'text',
          placeholder: 'eg. x.x.x.x/24'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: (data) => {
            console.log('Confirm Okay');
            let alert = {
              name: data['name'],
              filters: {
                ip: [data.ip]
              }
            }
            this.api.createNewNetworkAlert(alert).then((value) => {
              console.log(value);
              if ('created' in value) { // got created
                this.alerts.push(value); // 198.20.88.0/24
              } else {
                this.dialogBadAlert();
              }
            })
            
          }
        }
      ]
    });
    await alert.present();
  }

  async dialogBadAlert() {
    
    const alert = await this.alertController.create({
      header: 'Oops',
      // subHeader: 'Subtitle',
      message: 'We couldn\'t create this alert. Typo maybe?',
      buttons: [
        {
          text: 'Ok.',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });
    await alert.present();
  }  

  async dialogDelete(item: any) {
    
    const alert = await this.alertController.create({
      header: 'Delete alert',
      // subHeader: 'Subtitle',
      message: 'Are you sure you want to delete this network alert?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Okay');
            this.api.deleteNetWorkAlert(item.id);
            let index = this.alerts.indexOf(item);
            this.alerts.splice(index, 1);
          }
        }
      ]
    });
    await alert.present();
  }  
}
