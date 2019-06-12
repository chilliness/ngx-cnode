import { Component, OnInit, AfterViewInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-collect',
  templateUrl: './collect.component.html',
  styleUrls: ['./collect.component.scss']
})
export class CollectComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scroll', { static: false }) scrollRef: any;

  [x: string]: any;
  list = [];
  isAjax = false;
  isLoading = true;
  user: any = {};

  constructor(@Inject('shaw') $shaw, @Inject('share') private share$, private $router: Router, private $route: ActivatedRoute, private $store: Store<any>) {
    Object.assign(this, $shaw);

    // 此处select的state来自app.module中定义，subscribe的user来自app.store中定义
    this.$store$state = this.$store.select(({ state }) => state).subscribe(({ user }) => {
      this.user = user;
    });
  }

  ngOnInit() {
    this.handleFetchData();
  }

  ngAfterViewInit() {
    this.share$collect = this.share$.collect.subscribe(() => {
      clearTimeout(this.timerRefresh);
      this.timerRefresh = setTimeout(() => {
        clearTimeout(this.timerRefresh);
        this.scrollRef.handleRefresh();
      }, 310);
    });
  }

  ngOnDestroy() {
    this.$store$state.unsubscribe();
    this.share$collect.unsubscribe();
  }

  handleFormatTime(time) {
    return this.$moment(time, 'YYYYMMDD').fromNow().replace(/\s/g, '');
  }

  async handleFetchData() {
    if (this.isAjax) {
      return;
    }

    try {
      this.isAjax = true;
      const res = await this.$http({
        url: `${this.$api.collectList}/${this.$route.snapshot.params.name}`
      });
      this.isAjax = false;

      if (res.success) {
        this.isLoading = false;
        this.list = res.data;
        this.share$.handleSetCollect({ user: this.user, list: this.list });
      } else {
        this.share$.handleSetToast({ msg: res.error_msg });
      }
    } catch (e) {
      this.isAjax = false;
      this.share$.handleSetToast({ msg: this.$api.msg });
    }
  }
}
