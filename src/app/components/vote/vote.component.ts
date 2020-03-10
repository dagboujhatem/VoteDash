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
  votedSuccessfully = false;
  maxVoteError = false;
  sujets: any = [];
  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authorizationService: AuthorizationService) { }

  ngOnInit() {
    this.sujetForm = this.formBuilder.group({
      titre: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
    this.loadSujetDeVote();
  }

  // convenience getter for easy access to form fields
  get f() { return this.sujetForm.controls; }
  loadSujetDeVote() {
    this.api.getSujets().subscribe(
      response => {
        this.sujets = response;
      },
      errorResponse => {
        // if Autorisation Error
        if (errorResponse.status === 401) {
          this.autorisationError = true;
        }
      });
  }
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
        this.submitted = false;
        this.sujetForm.reset();
        this.loadSujetDeVote();
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
  voteOUI(sujet) {
    const voteData = {
      voteValue: true,
      backofficeUserId: this.authorizationService.getBackofficeUserId(),
      sujetId: sujet.id
    };
    this.api.addVote(voteData).subscribe(
      response => {
        this.votedSuccessfully = true;
        sujet.userVotedStatus = true;
      },
      errorResponse => {
        // if Autorisation Error
        if (errorResponse.error.error.statusCode === 401) {
          this.autorisationError = true;
          if ( errorResponse.error.error.code === 'MAX_VOTE') {
            this.maxVoteError = true;
          }
        }
      });
  }
  voteNON(sujet) {
    const voteData = {
      voteValue: false,
      backofficeUserId: this.authorizationService.getBackofficeUserId(),
      sujetId: sujet.id
    };
    this.api.addVote(voteData).subscribe(
      response => {
        this.votedSuccessfully = true;
        sujet.userVotedStatus = true;
      },
      errorResponse => {
        // if Autorisation Error
        if (errorResponse.error.error.statusCode === 401) {
          this.autorisationError = true;
          if ( errorResponse.error.error.code === 'MAX_VOTE') {
            this.maxVoteError = true;
          }
        }
      });
  }

}
