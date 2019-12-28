import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { SearchesPage } from './searches/searches.page';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  
  BOOKMARKS_VALUE = 'bookmarks';
  SEARCH_HISTORY = 'searches';
  IS_DARK_THEME = 'dark';

  constructor(public storage: Storage, public toast: ToastController) {
  }


  async isDarkTheme() {
    return this.getDarkTheme().then((value) => {
      return true && value;
    })
  }

  async getDarkTheme() {
    return this.storage.get(this.IS_DARK_THEME).then((value) => {
      if (value == undefined) {
        this.setDarkTheme(false).then((value) => {
        })
        return false;
      } else {
        return value;
      }
    });
  }

  async setDarkTheme(value: boolean) {
    return this.storage.set(this.IS_DARK_THEME, value)
  }

  async addSearch(search: string) {
    this.getSearches().then((searches) => {
      if (searches == null || searches == undefined) {
        searches = [];
      }
      searches.push(search)
      var uniq = searches.reduce(function(a,b){
        if (a.indexOf(b) < 0 ) a.push(b);
        return a;
      },[]);      
      this.storage.set(this.SEARCH_HISTORY, uniq)
    })
  }

  async getSearches() {
    return this.storage.get(this.SEARCH_HISTORY);
  }

  async addBookmark(type: string, key: string) {
    this.getBookmarks().then((bookmarks) => {
      if (bookmarks == null || bookmarks == undefined) {
        bookmarks = {};
      }

      // creating an item with type + key + value
      var item = {
        type: type,
        key: key,
        // value: value
      }
      // key will be eg. 127.0.0.1/host or country:eu/query
      var keyBookmark = key + '/' + type;
      console.log(keyBookmark);
      bookmarks[keyBookmark] = item;
      console.log(bookmarks);
      this.storage.set(this.BOOKMARKS_VALUE, bookmarks);
      this.displayToastMessage('Saved ' + type + ' "' + key + '" in your bookmarks!');
    })
  }

  async removeBookmark(type: string, key: string) {
    var keyBookmark = key + '/' + type;
    this.getBookmarks().then(bookmarks => {
      delete bookmarks[keyBookmark];
      this.displayToastMessage('Removing ' + type + ' "' + key + '" from your bookmarks!');
      return this.storage.set(this.BOOKMARKS_VALUE, bookmarks);
    });
  }

  async getBookmarks() {
    return this.storage.get(this.BOOKMARKS_VALUE); 
  }

  async displayToastMessage(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
  
  async flush() {
    this.displayToastMessage('Flushing your data!');
    return this.storage.clear();
    // return this.storage.remove(this.BOOKMARKS_VALUE);
  }

  async setAPIKey(value: string) {
    return this.storage.set('apiKey', value);
  }

  async getAPIKey() {
    return this.storage.get('apiKey');
  }
}
