import { Component, OnInit } from '@angular/core';
import { NavExtrasService } from '../nav-extras.service';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AlertController, } from '@ionic/angular';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.page.html',
  styleUrls: ['./search-results.page.scss'],
})
export class SearchResultsPage implements OnInit {

  query: string;
  results: any;
  loading: any;

  constructor(public api: ApiService, public navExtrasService: NavExtrasService, public router: Router, public loadingController: LoadingController, public alertController: AlertController, public storage: StorageService) {
      this.query = navExtrasService.getItem();
      console.log(this.query);
      this.search(this.query);
      this.presentLoading(this.query);
  }

  async presentLoading(query) {
    this.loading = await this.loadingController.create({
      message: 'Querying Shodan for "' + query + '"',
    });
    await this.loading.present();
  }


  search(query) {
    this.api.search(query).then((res) => {
      console.log(res);
      this.results = res;
      this.loading.dismiss();
    });
  }

  getMoreResults(infiniteScroll) {
    this.api.getMoreResults(this.query).then((res) => {
      console.log(res['matches'])
      this.results['matches'] = this.results['matches'].concat(res['matches']);
      infiniteScroll.target.complete();
    });
  }

  ngOnInit() {
  }

  async bookmarkSearch() {      
    const alert = await this.alertController.create({
      header: 'Bookmark',
      // subHeader: 'Subtitle',
      message: 'Do you want to bookmark that search (query:'+this.query+')?',
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
            this.storage.addBookmark('query', this.query);
            console.log('Confirm Okay');
            // this.toast.showToastMessage("Successfully " + this.title + " scriptlet!");
          }
        }
      ]
    });

    await alert.present();
  }

  getHostDetails(item) { 
    this.navExtrasService.setItem(item);
    this.router.navigateByUrl('/host-results');
  }

}