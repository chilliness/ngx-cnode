import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService, $api } from '../../service/http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  accesstoken = '';
  isAjax = false;
  msg = '';

  constructor(private $router: Router, private $http: HttpService) { }

  ngOnInit() {
  }

  onLogin() {
    if (this.isAjax || !this.accesstoken.replace(/\s/g, '').length) {
      return;
    }

    this.isAjax = true;
    this.msg = '';

    this.$http
      .post($api.accesstoken, { accesstoken: this.accesstoken })
      .subscribe(res => {
        if (res['success'] == $api.code) {
          sessionStorage.logined = 1;
          sessionStorage.accesstoken = this.accesstoken;
          this.$router.navigate(['/user', res.loginname], { replaceUrl: true });
        }
        this.isAjax = false;
      }, () => {
        this.msg = $api.tip;
        this.isAjax = false;
      });
  }

}
