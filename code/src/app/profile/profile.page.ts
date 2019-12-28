import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  private profile: any;
  private info: any;

  constructor(public api: ApiService, private router: Router) {
    this.profile = {
      'created': ''
    }
    this.getProfile();
  }

  ngOnInit() {
  }

  getProfile() {
    this.api.getProfile().then((res) => {
      console.log(res);
      this.profile = res;
      this.profile.created = this.profile.created.slice(0, -3);
      this.profile.created = this.profile.created + "Z";
      console.log(this.profile.created);
    });
    this.api.getAPIInfo().then((res) => {
      // console.log(res);
      this.info = res;
    })
  }

  disconnect() {
    this.api.disconnect();
    this.router.navigateByUrl('/ask-apikey');
  }

}
