import { Component, OnInit } from '@angular/core';
import { NavExtrasService } from '../nav-extras.service';
import { ApiService } from '../api.service';
import { LoadingController } from '@ionic/angular';
import { AlertController, } from '@ionic/angular';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-host-results',
  templateUrl: './host-results.page.html',
  styleUrls: ['./host-results.page.scss'],
})
export class HostResultsPage implements OnInit {

  private item: any;
  public selectedPort: any;
  public loading: any;

  constructor(public navExtrasService: NavExtrasService, public api: ApiService, public loadingController: LoadingController, public alertController: AlertController, public storage: StorageService) {
    let item = this.navExtrasService.getItem();
    if (item == undefined) {
      item = {
        'ip_str': '83.128.82.151'
      }      
    }

    this.presentLoading(item.ip_str);
    this.api.getHostDetails(item.ip_str).then((res) => {
      console.log(res);
      this.item = res;
      this.selectedPort = null;
      this.loading.dismiss();
    });
  }

  async presentLoading(ip: string) {
    this.loading = await this.loadingController.create({
      message: 'Loading host details for ' + ip,
    });
    await this.loading.present();
  }

  showPayload(port) {
    console.log(port);
    for (var i = 0; i < this.item.data.length; i++) {
      if (this.item.data[i].port == port) {
        console.log(this.item.data[i].port);
        this.selectedPort = this.item.data[i]
        console.log(this.selectedPort);
        break;
      }
    }
  }

  async bookmarkHost(host) {
    const alert = await this.alertController.create({
      header: 'Bookmark',
      // subHeader: 'Subtitle',
      message: 'Do you want to bookmark that host?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes!',
          handler: (data) => {
            console.log('Confirm Okay');
            this.storage.addBookmark('host', this.item.ip_str);
          }
        }
      ]
    });

    await alert.present();
  }

  ngOnInit() {
  }

}
