import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  fname = '' ;
  email = '';
  password = '';
  registred = false;

  constructor(private api: ApiService) { }

  ngOnInit() {
  }

  register() {
    this.api.register({
      username: this.fname,
      email: this.email,
      emailVerified: true,
      password: this.password
    }).subscribe(
      response => {
        this.registred = true;
        this.fname = '';
        this.email = '';
        this.password = '';
      },
      error => {
        console.log(error);
      });
  }

}
