import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavExtrasService {

  item: any;
  constructor() { }

  public setItem(item) {
    this.item = item;
  }

  public getItem() {
    return this.item;
  }  
}
