import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService, $api } from '../../service/http.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
declare let require: any;
const moment = require('moment');
moment.locale('zh-cn');

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
  animations: [
    trigger('slide', [
      state('in', style({ opacity: 1, height: '110px' })),
      transition(':enter', [
        style({
          height: 0,
          opacity: 0
        }),
        animate('0.3s ease-in')
      ]),
      transition(':leave', [
        animate('0.3s ease-in', style({
          height: 0,
          opacity: 0
        }))
      ])
    ])
  ]
})
export class TopicComponent implements OnInit {

  @ViewChild('scroll') scroll: ElementRef;

  content = {};
  id = '';
  logined = sessionStorage.logined;
  accesstoken = sessionStorage.accesstoken;
  nowPos = 0;

  constructor(private $router: Router, private $http: HttpService, private $route: ActivatedRoute) {
    this.id = this.$route.snapshot.params['id'];
  }

  ngOnInit() {
    this.onInitData();
    this.onMarkOne();
  }

  onInitData() {
    const params = {};
    if (this.logined == 1) {
      params['accesstoken'] = this.accesstoken;
    }
    this.$http
      .get($api.topic + this.id, { params })
      .subscribe(res => {
        if (res.success == $api.code) {
          this.content = res.data;

          this.content['replies'].forEach(item => {
            item['logined'] = false;
          });
        }
      }, err => console.log(err));
  }

  onCheckLogin(obj) {
    if (obj.logined) {
      obj.logined = false;
    } else {
      this.content['replies'].forEach(item => {
        if (item.id == obj.id) {
          obj.logined = true;
        } else {
          item.logined = false;
        }
      });
    }
  }

  onReply(obj, ev) {
    let content = ev.target.parentNode.querySelector('.text').value;
    const options = { accesstoken: this.accesstoken, content };
    if (!content.replace(/^\s|\s$/g, '').length) {
      return;
    }

    if (!obj.author_id) {
      // 官方api介绍的reply_id字段，我看到的值都为null，不知道是不是官方写的有问题
      options['reply_id'] = obj.reply_id;
    }

    this.$http
      .post(`${$api.replies}${this.content['id']}/replies`, options)
      .subscribe(res => {
        if (res.success == $api.code) {
          content = '';
          this.onInitData();
        }
      });
  }

  onToggleLove(obj) {
    if (this.logined != 1) {
      this.onCheckLogin(obj);
      return;
    }
    // 官方规定自己不能给自己点赞
    if (obj.author.loginname == JSON.parse(sessionStorage.user).loginname) {
      return;
    }
    this.$http
      .post(`${$api.ups}${obj.id}/ups`, {
        accesstoken: this.accesstoken
      })
      .subscribe(res => {
        if (res.success == $api.code) {
          (obj.is_uped = !obj.is_uped) ? obj.ups.push(1) : obj.ups.pop();
        }
      });
  }

  onLinkUser(obj) {
    this.$router.navigate(['/user', obj.author.loginname]);
  }

  onLogin() {
    this.$router.navigate(['/login']);
  }

  onMarkOne() {
    const id = this.$route.snapshot.queryParams['id'];
    const accesstoken = this.accesstoken;
    if (this.logined == 1 && accesstoken && id) {
      this.$http.post($api.mark_one + id, { accesstoken }).subscribe();
    }
  }

  onToggleCollection(bool) {
    let api;
    if (bool) {
      api = $api.de_collect;
    } else {
      api = $api.collect;
    }

    this.$http
      .post(api, {
        accesstoken: this.accesstoken,
        topic_id: this.id
      })
      .subscribe(res => {
        if (res.success == $api.code) {
          this.content['is_collect'] = !bool;
        }
      }, err => console.log(err));
  }

  onFormatTime(time) {
    return moment(time, 'YYYYMMDD').fromNow().replace(/\s/g, '');
  }

  onResetTop() {
    this.scroll['onScrollTo'](0, 0, 100);
  }

  onNowPos(ev) {
    this.nowPos = ev.y;
  }

}
