import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private storage: Storage, private router: Router) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {

      const isComplete = await this.storage.get('apiKey');
      console.log('isComplete = ' + isComplete);

      if (!isComplete || isComplete == null || isComplete === "") {
        this.router.navigateByUrl('/ask-apikey');
        return false;
      }
  
      return true;

  }
}
