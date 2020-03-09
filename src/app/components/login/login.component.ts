import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  unauthorizedError = false;

  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  login() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    const credentials = {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value
    };
    this.api.login(credentials).subscribe(
      responseLogin => {
          const authenticationObject = {
            accessToken: responseLogin.id,
            backofficeUserId: responseLogin.userId
          };
          localStorage.setItem('authenticationObject', JSON.stringify(authenticationObject));
          this.router.navigate(['/votes']);
        },
        errorResponse => {
        /* Unauthorized error */
        if(errorResponse.status === 401 ) {
          this.unauthorizedError = true;
          }
        });
  }

}
