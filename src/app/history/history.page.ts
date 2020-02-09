import { Component, OnInit } from '@angular/core';
import {StorageService} from '../storage.service';
import { NavExtrasService } from '../nav-extras.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  public searches = null;

  constructor(private storage: StorageService, public navExtrasService: NavExtrasService, public router: Router) {
  }

  ngOnInit() {
    this.storage.getSearches().then((searches) => {
      this.searches = searches;
      console.log(this.searches);
    });
  }

  searchShodan(item: string) {
    this.navExtrasService.setItem(item);
    this.router.navigateByUrl('/search-results');
  }
}
