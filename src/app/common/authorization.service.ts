import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import * as crypto from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService implements CanActivate, CanActivateChild {

  constructor(private router: Router) {
  }

  getLocalStorageObject(): any {
    const authenticationObject = localStorage.getItem('authenticationObject');
    if (authenticationObject !== undefined && authenticationObject !== null) {
      return JSON.parse(authenticationObject);
    } else {
      return null;
    }
  }

  setExpiredTokenDate(timeToLive: number, tokenDate: Date): any {
    const secondsTokenDate = tokenDate.getTime() / 1000;
    const expiredDateInSeconds = secondsTokenDate + timeToLive;
    const expiredTokenDate = new Date(1970, 0, 1); // Epoch
    expiredTokenDate.setSeconds(expiredDateInSeconds);
    return expiredTokenDate;
  }

  getExpiredTokenDate(): any {
    const authenticationObject = this.getLocalStorageObject();

    if (authenticationObject !== undefined && authenticationObject !== null) {
      return authenticationObject['expiredTokenDate'];
    } else {
      return null;
    }
  }

  getAccesToken(): any {
    const authenticationObject = this.getLocalStorageObject();

    if (authenticationObject !== undefined && authenticationObject !== null) {
      return authenticationObject['accessToken'];
    } else {
      return null;
    }
  }

  setBackofficeUserId(userId) {
    const cipherBackofficeUserId = crypto.AES.encrypt(userId, 'ascefb');
    localStorage.setItem('backofficeUserId', cipherBackofficeUserId.toString());
  }

  getBackofficeUserId() {
    const backofficeUserId = localStorage.getItem('backofficeUserId');
    if (backofficeUserId !== undefined && backofficeUserId !== null) {
      const backofficeUserIdDecypted = crypto.AES.decrypt(backofficeUserId.toString(), 'ascefb').toString(crypto.enc.Utf8);
      return backofficeUserIdDecypted;
    } else {
      return '';
    }
  }

  isNotExpiredDate() {
    const expiredDate = this.getExpiredTokenDate();
    if (expiredDate !== undefined && expiredDate !== null) {
      const dateExpired = new Date(expiredDate);
      const actualDate = new Date();
      if (actualDate <= dateExpired) {
        return true;

      } else {

        return false;

      }
    } else {
      return false;
    }
  }


  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): boolean {
    return this.checkLogin();
  }


  checkLogin(): boolean {
    let isAuth: boolean;
    isAuth = true;
    const isNotExpiredDate = this.isNotExpiredDate();
    if (isNotExpiredDate) {
      const token = this.getAccesToken();
      if (token === null) {
        isAuth = false;
        this.router.navigate(['/login']);
      } else {
        isAuth = true;
      }
    } else {
      isAuth = false;
      this.router.navigate(['/login']);
    }
    return isAuth;
  }

  removeLocalStorageItems() {
    localStorage.removeItem('authenticationObject');
    localStorage.removeItem('backofficeUserId');
  }

  canActivateChild(route: ActivatedRouteSnapshot,
                   state: RouterStateSnapshot): boolean {

    const routeUrl = state.url;
    if (routeUrl !== undefined && routeUrl !== null) {
      return true;
    } else {
      return false;
    }
  }

}
