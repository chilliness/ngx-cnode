import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService, $api } from '../../service/http.service';
declare let require: any;
const moment = require('moment');
moment.locale('zh-cn');

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  @ViewChild('scroll') scroll: ElementRef;

  nowPos = 0;
  user = {};
  user2 = [];
  list = [];
  loginname = '';

  constructor(private $router: Router, private $http: HttpService, private $route: ActivatedRoute) {
    this.loginname = this.$route.snapshot.params['loginname'];
  }

  ngOnInit() {
    this.onInitData();
  }

  onInitData() {
    this.$http.get($api.user + this.loginname).subscribe((res1) => {
      if (res1.success == $api.code) {
        this.$http.get($api.topic_collect + this.loginname).subscribe((res2) => {
          if (res2.success == $api.code) {
            this.user = res1.data;
            this.user2 = res2.data;
            this.list = [
              ...this.user['recent_topics'],
              ...this.user['recent_replies'],
              ...this.user2
            ];
            if (sessionStorage.logined == 1 && !sessionStorage.user) {
              sessionStorage.user = JSON.stringify(res1.data);
            }
          }
        });
      }
    });
  }

  onResetTop() {
    this.scroll['onScrollTo'](0, 0, 100);
  }

  onNowPos(ev) {
    this.nowPos = ev.y;
  }

  onFormatTime(time) {
    return moment(time, 'YYYYMMDD').fromNow().replace(/\s/g, '');
  }

  onLink(item) {
    this.$router.navigate(['/topic', item.id]);
  }

}
