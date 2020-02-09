import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  private apiUrl = "https://api.shodan.io";
  public apiKey = "";
  private pageQueries = 1;
  private pageResults = 1;

  constructor(public http: HttpClient, public toast: ToastController, public storage: StorageService) {
    this.storage.getAPIKey().then((value) => {
      // console.log(value);
      this.apiKey = value;
    })
  }

  // Host Information
  // Returns all services that have been found on the given host IP.
  async getHostDetails(ip: string) {
    var tmpUrl = this.apiUrl + "/shodan/host/" + ip + "?key=" + this.apiKey;
    // this.displayToastMessage("Fetching results for IP: " + ip + "...")
    return new Promise(resolve => {
      this.http.get(tmpUrl).subscribe(data => {
        resolve(data);
      },
      err => {
        console.log(err);
      });
    })
  }

  // Search Shodan without Results
  // This method behaves identical to "/shodan/host/search" with the only difference that this method does not return any host results,
  // it only returns the total number of results that matched the query and any facet information that was requested. 
  // As a result this method does not consume query credits.
  async getHostsCount(query: string, facets: string) {
    var tmpUrl = this.apiUrl + "/shodan/host/count" + "?key=" + this.apiKey;
    this.http.get(tmpUrl, {}).subscribe((res) => {
      console.log(res);
    })
  }

  // Search Shodan
  // Search Shodan using the same query syntax as the website and use facets to get summary information for different properties.
  // , facets: string
  async search(query: string) {
    var tmpUrl = this.apiUrl + "/shodan/host/search?" + "query=" + query + "&key=" + this.apiKey;
    // this.displayToastMessage("Fetching results for " + query + "...")
    return new Promise(resolve => {
      this.http.get(tmpUrl).subscribe(data => {
        resolve(data);
      },
      err => {
        console.log(err);
      });
    })
  }

  async getMoreResults(query:string) {
    this.pageResults++;
    var tmpUrl = this.apiUrl + "/shodan/host/search?" + "query=" + query + "&key=" + this.apiKey + "&page=" + this.pageQueries;
    this.displayToastMessage("Fetching more results...");
    return new Promise(resolve => {
      this.http.get(tmpUrl).subscribe(data => {
        resolve(data);
      },
      err => {
        console.log(err);
      });
    });    
  }

  async getPorts() {
    var tmpUrl = this.apiUrl + "/shodan/ports?key=" + this.apiKey;
    console.log(tmpUrl);
    return new Promise(resolve => {
      this.http.get(tmpUrl).subscribe(data => {
        resolve(data);
      },
      err => {
        console.log(err);
      });
    });
  }


  // List the saved search queries
  // Use this method to obtain a list of search queries that users have saved in Shodan.
  async getQueries() {
    var tmpUrl = this.apiUrl + "/shodan/query?key=" + this.apiKey + "&sort=votes";
    this.displayToastMessage("Fetching queries...");
    return new Promise(resolve => {
      this.http.get(tmpUrl).subscribe(data => {
        resolve(data);
      },
      err => {
        console.log(err);
      });
    });
  }

  async getMoreQueries() {
    this.pageQueries++;
    var tmpUrl = this.apiUrl + "/shodan/query?key=" + this.apiKey + "&sort=votes&page=" + this.pageQueries;
    // this.displayToastMessage("Fetching more queries...");
    return new Promise(resolve => {
      this.http.get(tmpUrl).subscribe(data => {
        resolve(data);
      },
      err => {
        console.log(err);
      });
    });    
  }

  async getNetworkAlerts() {
    var tmpUrl = this.apiUrl + "/shodan/alert/info?key=" + this.apiKey;
    this.displayToastMessage("Fetching network alerts...");
    return new Promise(resolve => {
      this.http.get(tmpUrl).subscribe(data => {
        resolve(data);
      },
      err => {
        console.log(err);
      })
    });
  }

  async createNewNetworkAlert(data) {
    let alert = JSON.stringify(data);
    console.log(alert);
    var tmpUrl = this.apiUrl + "/shodan/alert?key=" + this.apiKey;
    this.displayToastMessage("Creating network alert '" + data.name + "'");
    return new Promise(resolve => {
      this.http.post(tmpUrl, alert).subscribe(result => {
        this.displayToastMessage("Created network alert '" + data.name + "' successfully!");
        resolve(result);
      },
      err => {
        console.log(err);
        resolve(err);
      })
    })
  }

  async deleteNetWorkAlert(id: string) {
    var tmpUrl = this.apiUrl + "/shodan/alert/" + id + "?key=" + this.apiKey;
    this.displayToastMessage("Deleting network alert " + id);
    let headers = {'content-type': 'text/plain'}
    return new Promise(resolve => {
      this.http.delete(tmpUrl).subscribe(result => {
        resolve(result);
      },
      err => {
        resolve(err);
      })
    })
  }

  async getNetworkAlertInfo(id: string) {
    var tmpUrl = this.apiUrl + "/shodan/alert/" + id + "/info?key=" + this.apiKey;
    this.displayToastMessage("Fetching info for alert " + id);
    return new Promise(resolve => {
      this.http.get(tmpUrl).subscribe(result => {
        resolve(result)
      },
      err => {
        resolve(err);
      })
    })
  }

  async getProfile() {
    var tmpUrl = this.apiUrl + "/account/profile?key=" + this.apiKey;
    this.displayToastMessage("Fetching profile data...");
    return new Promise(resolve => {
      this.http.get(tmpUrl).subscribe(data => {
        resolve(data);
      },
      err => {
        console.log(err);
        resolve(err);
      });
    });
  }

  async getAPIInfo() {
    var tmpUrl = this.apiUrl + "/api-info?key=" + this.apiKey;
    this.displayToastMessage("Fetching API key info...");
    return new Promise(resolve => {
      this.http.get(tmpUrl).subscribe(data => {
        console.log(data);
        resolve(data);
      },
      err => {
        console.log(err);
        resolve(err);
      })
    })
  }

  async disconnect() {
    this.displayToastMessage("Disconnecting...");
    this.storage.setAPIKey(undefined).then((value) => {
      this.apiKey = value;
    })
    this.storage.flush().then((value) => {

    })
  }

  async displayToastMessage(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
}

export class Query {
  description: string;
  query: string;
  tags: Array<string>;
  timestamp: Date;
  title: string;
  votes: number;
}