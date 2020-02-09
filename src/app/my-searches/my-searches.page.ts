import { Component, OnInit } from '@angular/core';
import { StorageService } from '../storage.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NavExtrasService } from '../nav-extras.service';

@Component({
  selector: 'app-my-searches',
  templateUrl: './my-searches.page.html',
  styleUrls: ['./my-searches.page.scss'],
})
export class MySearchesPage implements OnInit {

  private bookmarks: any;

  constructor(public storage: StorageService, public alertController: AlertController, public router: Router, public navExtrasService: NavExtrasService) {
    this.bookmarks = [];
    this.storage.getBookmarks().then(bookmarks => {
      // this.bookmarks = bookmarks;
      for (var key in bookmarks) {
        this.bookmarks.push(bookmarks[key]);
      }
      console.log(this.bookmarks);
    })
  }

  ngOnInit() {
  }

  async flush() {
    const alert = await this.alertController.create({
      header: 'Flush',
      // subHeader: 'Subtitle',
      message: 'Are you sure you want to delete ALL the bookmarks ?',
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
            this.storage.flush().then(() => {
              this.bookmarks = [];
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async dialogDelete(item: any) {
    
    const alert = await this.alertController.create({
      header: 'Delete bookmark',
      // subHeader: 'Subtitle',
      message: 'Are you sure you want to delete this bookmark ?',
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
            this.storage.removeBookmark(item.type, item.key);
            let index = this.bookmarks.indexOf(item);
            this.bookmarks.splice(index, 1);            
          }
        }
      ]
    });
    await alert.present();
  }

  shortcutBookmark(item: any) {
    console.log(item);
    // this.query || this.ip_str
    if (item.type == 'host') {
      item['ip_str'] = item.key;
      this.navExtrasService.setItem(item);
      this.router.navigateByUrl('/host-results');
    } else {
      this.navExtrasService.setItem(item.key);
      this.router.navigateByUrl('/search-results');      
    }
  }

}
