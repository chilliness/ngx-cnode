import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService, $api } from '../../service/http.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
declare let require: any;
const moment = require('moment');
moment.locale('zh-cn');

const LIMIT = 20;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('opacity', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.2s')
      ]),
      transition(':leave', [
        animate('0.2s', style({ opacity: 0 }))
      ])
    ]),
    trigger('slide', [
      state('in', style({ transform: 'translate3d(0, 0, 0)' })),
      transition(':enter', [
        style({
          transform: 'translate3d(-100%, 0, 0)'
        }),
        animate('0.2s')
      ]),
      transition(':leave', [
        animate('0.2s', style({
          transform: 'translate3d(-100%, 0, 0)'
        }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {

  @ViewChild('scroll') scroll: ElementRef;

  active = sessionStorage.active || 'all';
  menus = [
    { name: '全部', alias: 'all' },
    { name: '精华', alias: 'good' },
    { name: '分享', alias: 'share' },
    { name: '问答', alias: 'ask' },
    { name: '招聘', alias: 'job' }
  ];
  list = [];
  page = 1;
  limit = LIMIT;
  avatar = require('./default.jpg');
  isPullOver = false;
  isLoading = {
    loadFlag: false,
    refreshFlag: true
  };
  isAjax = false;
  isMark = false;
  logined = sessionStorage.logined;
  user = JSON.parse(sessionStorage.user || '{}');
  unreadNum = 0;
  nowPos = 0;
  pullDownRefresh = {
    threshold: 50,
    stop: 50,
    txt: '刷新成功'
  };
  pullUpLoad = {
    threshold: 0,
    txt: {
      more: '加载数据',
      noMore: '我是有底线的'
    }
  };

  constructor(private $http: HttpService, private $router: Router) { }

  ngOnInit() {
    this.onUnreadCount();
    this.onInitDate();
  }


  onSelect(item) {
    this.active = sessionStorage.active = item.alias;
    // 置顶
    this.onResetTop();
    // 重新加载数据
    this.onInitDate(true);
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

  onInitDate(bool?, options = {}) {
    if (this.isAjax) {
      return;
    }

    this.isAjax = true;

    // 是否是刷新操作
    if (bool) {
      this.page = 1;
      this.isPullOver = false;
    }

    if (this.isPullOver) {
      return;
    }

    this.isLoading.loadFlag = this.isLoading.refreshFlag = true;
    const params = { page: this.page, limit: this.limit };

    if (this.active != 'all') {
      params['tab'] = this.active;
    }

    this.$http
      .get($api.topics, { params })
      .subscribe(res => {
        if (res.success == $api.code) {
          if (this.page++ == 1) {
            this.list.length = 0;
          }
          // 当前分类是否还有数据 | (此处判断并不完善，介于api没有提供额外参数，所以只能这样做)
          this.isPullOver = res.data.length != LIMIT;
          this.list = this.list.concat(res.data);

          if (options['isRefresh']) {
            this.scroll['onFnishPullDown']();
          }

          if (options['isLoading']) {
            this.scroll['onFnishPullUp']();
          }
        }
        this.isAjax = false;
      }, () => (this.isAjax = false));
  }

  onLogout() {
    if (confirm('你确定要退出登录?')) {
      this.logined = sessionStorage.logined = 0;
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('accesstoken');
      this.isMark = false;
    }
  }

  onUnreadCount() {
    const accesstoken = sessionStorage.accesstoken;
    if (this.logined == 1 && accesstoken) {
      this.$http
        .get($api.count, {
          params: {
            accesstoken
          }
        })
        .subscribe(res => {
          if (res.success == $api.code) {
            this.unreadNum = res.data;
          }
        });
    }
  }

}
