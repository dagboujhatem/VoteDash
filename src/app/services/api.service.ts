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
  login( credentials) {
    return this.http.post(this.url + '/BackofficeUsers/login', credentials);
  }/*
  logout() {
    return this.http.post(this.url + '/BackofficeUsers/logout', this.authorizationService.getAccesToken());
  }*/
  getSujets(){
    return this.http.get(this.url + '/Sujets/findSujet');
  }
  addSujet(sujetData) {
    return this.http.post(this.url + '/Sujets/', sujetData);
  }
  addVote(voteData) {
    return this.http.post(this.url + '/Votes/addVote/', voteData);
  }

}
