import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { StorageService } from './storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public version = "io.shodan.app v0.0.5";
  public isDarkTheme = false;
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Search History',
      url: '/history',
      icon: 'search'
    },    
    {
      title: 'Queries',
      url: '/queries',
      icon: 'globe'
    },
    {
      title: 'My bookmarks',
      url: '/my-searches',
      icon: 'save'
    },
    {
      title: 'Network alerts',
      url: '/alerts',
      icon: 'alert'
    },
    {
      title: 'My profile',
      url: '/profile',
      icon: 'settings'
    },
    {
      title: 'About',
      url: '/about',
      icon: 'information'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: StorageService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.storage.isDarkTheme().then((res) => {
        document.body.classList.toggle('dark', res);
        this.isDarkTheme = res;
        // console.log('isDarkTheme = ' + res);
      })

      const toggle = document.querySelector('#themeToggle');
      console.log(toggle);

      toggle.addEventListener('ionChange', (ev) => {
        console.log(ev);
        document.body.classList.toggle('dark', (<any>ev).detail.checked);
        this.storage.setDarkTheme((<any>ev).detail.checked);
      });

    });
  }
}
