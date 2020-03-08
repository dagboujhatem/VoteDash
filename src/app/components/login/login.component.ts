import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email = '';
  password = '';

  constructor(
    private api: ApiService,
    private router: Router,
    ) { }

  ngOnInit() {
  }

  login() {
      this.api.login({ email: this.email, password: this.password}).subscribe(
        responseLogin => {
          /*  const token = responseLogin.id;
            const expiredTokenDate = this.authorizationService.setExpiredTokenDate(responseLogin.ttl, new Date());
            let authenticationObject = {
              accessToken: token,
              expiredTokenDate: expiredTokenDate,
            };
            localStorage.setItem('authenticationObject', JSON.stringify(authenticationObject));

            this.authenticationService.getRoleUserBackOffice(token).subscribe(responseRoleUser => {
              authenticationObject =    Object.assign(authenticationObject, {email: responseRoleUser.email});
              localStorage.setItem('authenticationObject', JSON.stringify(authenticationObject));
              localStorage.setItem('avatar', responseRoleUser.avatar);
              this.authorizationService.setRole(responseRoleUser.roles[0].name);
              if (!isNullOrUndefined(this.redirectUrl)) {
                this.router.navigate([this.redirectUrl]);
              } else {
                this.router.navigate(['/votes']);
              }
            }, () => {
              this.errorExists = true;
            });*/
        },
        err => {
        console.log(err);
        }
      );
  }

}
