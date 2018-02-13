import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpService, $api } from '../../service/http.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
declare let require: any;
const moment = require('moment');
moment.locale('zh-cn');

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @ViewChild('scroll') scroll: ElementRef;

  readList = [];
  unreadList = [];
  active = false;
  isAjax = false;
  nowPos = 0;

  constructor(private $http: HttpService, private $router: Router, private location: Location) { }

  ngOnInit() {
    this.onInitData();
  }

  onInitData() {
    this.$http
      .get($api.messages, { params: { accesstoken: sessionStorage.accesstoken } })
      .subscribe(res => {
        if (res.success == $api.code) {
          this.readList = res.data.has_read_messages;
          this.unreadList = res.data.hasnot_read_messages;
        }
      });
  }

  onResetTop() {
    this.scroll['onScrollTo'](0, 0, 100);
  }

  onNowPos(ev) {
    this.nowPos = ev.y;
  }

  onList() {
    return this.active ? this.readList : this.unreadList;
  }

  onFormatTime(time) {
    return moment(time, 'YYYYMMDD').fromNow().replace(/\s/g, '');
  }

  onToggleNav(bool) {
    this.active = bool;
    this.onResetTop();
  }

  onClearUnread() {
    if (confirm('你确定要清空未读消息?')) {
      this.$http
        .post($api.mark_all, {
          accesstoken: sessionStorage.accesstoken
        })
        .subscribe(res => {
          if (res.success == $api.code) {
            this.onInitData();
          }
        });
    }
  }
}
