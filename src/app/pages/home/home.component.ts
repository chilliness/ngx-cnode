import { Component, OnInit, AfterViewInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scroll', { static: false }) scrollRef: any;

  [x: string]: any;
  form = {
    list: [],
    page: 1,
    size: 20,
    active: { tab: 'all', index: 0 }
  };
  menus = [
    { text: '全部', alias: 'all' },
    { text: '精华', alias: 'good' },
    { text: '分享', alias: 'share' },
    { text: '问答', alias: 'ask' },
    { text: '招聘', alias: 'job' }
  ];
  pullDownRefresh = {
    threshold: 60,
    stop: 60,
    txt: '刷新成功'
  };
  pullUpLoad = {
    threshold: 0,
    txt: {
      more: '加载数据',
      noMore: '我是有底线的'
    }
  };
  isAjax = false;
  isLoading = true;
  loginBarFlag = false;
  avatar = require('./img/avatar.jpg');
  user: any = {};

  constructor(@Inject('shaw') $shaw, @Inject('share') private share$, private $router: Router, private $store: Store<any>) {
    Object.assign(this, $shaw);

    // 此处select的state来自app.module中定义，subscribe的user来自app.store中定义
    this.$store$state = this.$store.select(({ state }) => state).subscribe(({ user }) => {
      !user.avatar_url && (user.avatar_url = this.avatar);
      this.user = user;
    });
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.handleFetchData();
    this.share$data = this.share$.data.subscribe(() => {
      clearTimeout(this.timerRefresh);
      this.timerRefresh = setTimeout(() => {
        clearTimeout(this.timerRefresh);
        this.scrollRef.handleRefresh();
      }, 310);
    });
  }

  ngOnDestroy() {
    this.$store$state.unsubscribe();
    this.share$data.unsubscribe();
  }

  handleFormatTime(time) {
    return this.$moment(time, 'YYYYMMDD').fromNow().replace(/\s/g, '');
  }

  handleChangeTab(tab, index) {
    if (!this.isAjax) {
      this.isLoading = true;
      this.form.active = { tab, index };
      this.handleFetchData(true);
    }
  }

  handleToggleLoginBar(bool) {
    this.loginBarFlag = bool;
  }

  handleLink(name) {
    this.handleToggleLoginBar(false);
    this.$router.navigate([`/${name}`, this.user.loginname]);
  }

  handleLogout() {
    this.handleToggleLoginBar(false);
    this.share$.handleSetConfirm({
      msg: '你确定要退出登录吗？',
      confirm: () => {
        this.$store.dispatch({ type: 'user', payload: {} });
        this.$store.dispatch({ type: 'login', payload: 0 });
      }
    });
  }

  async handleFetchData(isRefresh = false) {
    if (this.isAjax) {
      return;
    }

    if (isRefresh) {
      this.form.page = 1;
      this.scrollRef.handleScrollTo();
    }

    try {
      this.isAjax = true;
      const res = await this.$http({
        url: `${this.$api.topicList}?page=${this.form.page}&limit=${
          this.form.size
          }&tab=${this.form.active.tab}`
      });
      this.isAjax = false;

      if (res.success) {
        if (isRefresh) {
          this.form.list = res.data;
          this.scrollRef.handleFinshPullDown();
        } else {
          this.form.list.push(...res.data);
          this.scrollRef.handleFinshPullUp(!res.data.length);
        }
        this.isLoading = false;
        this.form.page++;
        this.share$.handleSetData(this.form.list);
      } else {
        this.share$.handleSetToast({ msg: res.error_msg });
        isRefresh && this.scrollRef.handleFinshPullDown(this.$api.msg);
      }
    } catch (e) {
      this.isAjax = false;
      this.share$.handleSetToast({ msg: this.$api.msg });
      isRefresh && this.scrollRef.handleFinshPullDown(this.$api.msg);
    }
  }

  async handleLogin() {
    if (this.isAjax || this.user.loginname) {
      return;
    }

    try {
      this.isAjax = true;
      const res = await this.$http({ url: this.$api.login, data: {} });
      this.isAjax = false;

      if (res.success) {
        this.$store.dispatch({ type: 'user', payload: res });
        this.$store.dispatch({ type: 'login', payload: 1 });
      } else {
        this.share$.handleSetToast({ msg: res.error_msg });
      }
    } catch (e) {
      this.isAjax = false;
      this.share$.handleSetToast({ msg: this.$api.msg });
    }
  }

  handleBy(index) {
    return index;
  }
}
