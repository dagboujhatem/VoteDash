import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// import custom validator to validate that password and confirm password fields match
import {MustMatch} from '../../_helpers/must-match.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;
  registred = false;
  errorsFromServer = false;
  errorsMessage = '';

  constructor(private api: ApiService,
              private router: Router,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  register() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    const user = {
      username: this.registerForm.get('username').value,
      email: this.registerForm.get('email').value,
      emailVerified: true,
      password: this.registerForm.get('password').value
    };

    this.api.register(user).subscribe(
      response => {
        this.registred = true;
      },
      errorResponse => {
        // if Validation Error
        if (errorResponse.status == 422) {
          this.errorsFromServer = true;
          this.showErrorsMessage(errorResponse.error);
        }
      });
  }
  showErrorsMessage( error) {
    if(error.error.details.messages !== undefined && error.error.details.messages !== null) {
      if(error.error.details.messages.username !== undefined) {
        this.errorsMessage = 'Username already exists';
      }
      if(error.error.details.messages.email !== undefined) {
        this.errorsMessage = error.error.details.messages['email'];
      }
    }
  }

}
