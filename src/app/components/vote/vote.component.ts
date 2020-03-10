import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../services/api.service';
import {Router} from '@angular/router';
import {AuthorizationService} from '../../common/authorization.service';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {

  sujetForm: FormGroup;
  submitted = false;
  addedSuccessfully = false;
  autorisationError = false;
  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authorizationService: AuthorizationService,) { }

  ngOnInit() {
    this.sujetForm = this.formBuilder.group({
      titre: ['', [Validators.required, Validators.email]],
      description: ['', [Validators.required]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.sujetForm.controls; }

  addSujet() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.sujetForm.invalid) {
      return;
    }

    const sujetData = {
      titre: this.sujetForm.get('titre').value,
      description: this.sujetForm.get('description').value
    };

    this.api.addSujet(sujetData).subscribe(
      response => {
        this.addedSuccessfully = true;
        this.sujetForm.reset();
      },
      errorResponse => {
        // if Autorisation Error
        if (errorResponse.status === 401) {
          this.autorisationError = true;
        }
      });
  }
  logout() {
    this.api.logout().subscribe(
      response => {
        this.authorizationService.removeLocalStorageItems();
        this.router.navigate(['/login']);
      },
      error => {}
    );
  }

}
