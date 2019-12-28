import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { NavExtrasService } from '../nav-extras.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-queries',
  templateUrl: './queries.page.html',
  styleUrls: ['./queries.page.scss'],
})
export class QueriesPage implements OnInit {
  queries: any;

  constructor(public api: ApiService, public router: Router, public navExtrasService: NavExtrasService, public storage: StorageService) {
    this.getQueries();
  }

  ngOnInit() {
  }

  searchQuery(item) {
    console.log(item.query);
    this.storage.addSearch(item.query);
    this.navExtrasService.setItem(item.query);
    this.router.navigateByUrl('/search-results');
  }

  getQueries() {
    this.api.getQueries().then((res) => {
      console.log(res['matches']);
      this.queries = res['matches']
    });
  }
  
  getMoreQueries(infiniteScroll) {
    this.api.getMoreQueries().then((res) => {
      console.log(res['matches'])
      this.queries = this.queries.concat(res['matches']);
      infiniteScroll.target.complete();
    });
  }
}
