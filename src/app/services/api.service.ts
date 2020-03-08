import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url = environment.serverUrl;

  constructor(private http: HttpClient) { }

  register(newUser) {
    return this.http.post(this.url + '/BackofficeUsers/', newUser);
  }
  login( user) {
    return this.http.post(this.url + '/BackofficeUsers/login', user);
  }/*
  logout() {
    return this.http.post(this.url + '/BackofficeUsers/logout', this.authorizationService.getAccesToken());
  }*/

}
