import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { NavExtrasService } from '../nav-extras.service';
import { Router } from '@angular/router';
import { ToastController, MenuController } from '@ionic/angular';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  queries: any;
  query: string;
  filters = [
    {
       "filter":"after",
       "description":"Only show results that were collected after the given date (dd/mm/yyyy)."
    },
    {
       "filter":"asn",
       "description":"The Autonomous System Number that identifies the network the device is on."
    },
    {
       "filter":"before",
       "description":"Only show results that were collected before the given date (dd/mm/yyyy."
    },
    {
       "filter":"city",
       "description":"Show results that are located in the given city."
    },
    {
       "filter":"country",
       "description":"Show results that are located within the given country."
    },
    {
       "filter":"geo",
       "description":"There are 2 modes to the geo filter: radius and bounding box. To limit results based on a radius around a pair of latitude/ longitude, provide 3 parameters; ex: geo:50,50,100. If you want to find all results within a bounding box, supply the top left and bottom right coordinates for the region; ex: geo:10,10,50,50."
    },
    {
       "filter":"hash",
       "description":"Hash of the \"data\" property"
    },
    {
       "filter":"has_ipv6",
       "description":"If \"true\" only show results that were discovered on IPv6."
    },
    {
       "filter":"has_screenshot",
       "description":"If \"true\" only show results that have a screenshot available."
    },
    {
       "filter":"hostname",
       "description":"Search for hosts that contain the given value in their hostname."
    },
    {
       "filter":"isp",
       "description":"Find devices based on the upstream owner of the IP netblock."
    },
    {
       "filter":"link",
       "description":"Find devices depending on their connection to the Internet."
    },
    {
       "filter":"net",
       "description":"Search by netblock using CIDR notation; ex: net:69.84.207.0/24"
    },
    {
       "filter":"org",
       "description":"Find devices based on the owner of the IP netblock."
    },
    {
       "filter":"os",
       "description":"Filter results based on the operating system of the device."
    },
    {
       "filter":"port",
       "description":"Find devices based on the services/ ports that are publicly exposed on the Internet."
    },
    {
       "filter":"postal",
       "description":"Search by postal code."
    },
    {
       "filter":"product",
       "description":"Filter using the name of the software/ product; ex: product:Apache"
    },
    {
       "filter":"state",
       "description":"Search for devices based on the state/ region they are located in."
    },
    {
       "filter":"version",
       "description":"Filter the results to include only products of the given version; ex: product:apache version:1.3.37"
    },
    {
       "filter":"bitcoin.ip",
       "description":"Find Bitcoin servers that had the given IP in their list of peers."
    },
    {
       "filter":"bitcoin.ip_count",
       "description":"Find Bitcoin servers that return the given number of IPs in the list of peers."
    },
    {
       "filter":"bitcoin.port",
       "description":"Find Bitcoin servers that had IPs with the given port in their list of peers."
    },
    {
       "filter":"bitcoin.version",
       "description":"Filter results based on the Bitcoin protocol version."
    },
    {
       "filter":"http.component",
       "description":"Name of web technology used on the website"
    },
    {
       "filter":"http.component_category",
       "description":"Category of web components used on the website"
    },
    {
       "filter":"http.html",
       "description":"Search the HTML of the website for the given value."
    },
    {
       "filter":"http.html_hash",
       "description":"Hash of the website HTML"
    },
    {
       "filter":"http.status",
       "description":"Response status code"
    },
    {
       "filter":"http.title",
       "description":"Search the title of the website"
    },
    {
       "filter":"ntp.ip",
       "description":"Find NTP servers that had the given IP in their monlist."
    },
    {
       "filter":"ntp.ip_count",
       "description":"Find NTP servers that return the given number of IPs in the initial monlist response."
    },
    {
       "filter":"ntp.more",
       "description":"Whether or not more IPs were available for the given NTP server."
    },
    {
       "filter":"ntp.port",
       "description":"Find NTP servers that had IPs with the given port in their monlist."
    },
    {
       "filter":"ssl",
       "description":"Search all SSL data"
    },
    {
       "filter":"ssl.alpn",
       "description":"Application layer protocols such as HTTP/2 (\"h2\")"
    },
    {
       "filter":"ssl.chain_count",
       "description":"Number of certificates in the chain"
    },
    {
       "filter":"ssl.version",
       "description":"Possible values: SSLv2, SSLv3, TLSv1, TLSv1.1, TLSv1.2"
    },
    {
       "filter":"ssl.cert.alg",
       "description":"Certificate algorithm"
    },
    {
       "filter":"ssl.cert.expired",
       "description":"Whether the SSL certificate is expired or not; True/ False"
    },
    {
       "filter":"ssl.cert.extension",
       "description":"Names of extensions in the certificate"
    },
    {
       "filter":"ssl.cert.serial",
       "description":"Serial number as an integer or hexadecimal string"
    },
    {
       "filter":"ssl.cert.pubkey.bits",
       "description":"Number of bits in the public key"
    },
    {
       "filter":"ssl.cert.pubkey.type",
       "description":"Public key type"
    },
    {
       "filter":"ssl.cipher.version",
       "description":"SSL version of the preferred cipher"
    },
    {
       "filter":"ssl.cipher.bits",
       "description":"Number of bits in the preferred cipher"
    },
    {
       "filter":"ssl.cipher.name",
       "description":"Name of the preferred cipher"
    },
    {
       "filter":"telnet.option",
       "description":"Search all the options"
    },
    {
       "filter":"telnet.do",
       "description":"The server requests the client to support these options"
    },
    {
       "filter":"telnet.dont",
       "description":"The server requests the client to not support these options"
    },
    {
       "filter":"telnet.will",
       "description":"The server supports these options"
    },
    {
       "filter":"telnet.wont",
       "description":"The server doesnt support these options"
    }]

  constructor(public api: ApiService, public navExtrasService: NavExtrasService, public router: Router, public toast: ToastController, public menuCtrl: MenuController, public storage: StorageService) {
    this.query = '';
  }

  getQueries() {
    this.api.getQueries().then((res) => {
      console.log(res['matches']);
      this.queries = res['matches']
    });
  }

  changeQuery(item) {
    console.log(item);
    this.query = item.query;
  }

  getMoreQueries(infiniteScroll) {
    this.api.getMoreQueries().then((res) => {
      console.log(res['matches'])
      this.queries = this.queries.concat(res['matches']);
      infiniteScroll.target.complete();
    });
  }

  searchShodan(item: string) {
   this.storage.addSearch(item);
    console.log(item);
    this.navExtrasService.setItem(item);
    this.router.navigateByUrl('/search-results');
  }

  addFilter(filter: any) {
     if (this.query.indexOf(filter.filter) == -1) {
      this.query = this.query + " " + filter.filter + ":";
      this.displayToastMessage("Added " + filter.filter + " in the query box!");
     }
  }

  async displayToastMessage(message) {
   const toast = await this.toast.create({
     message: message,
     duration: 2000
   });
   toast.present();
 }


 ionViewWillEnter() {
   this.menuCtrl.enable(true);
 }
}
