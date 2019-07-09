import { Component, OnInit, AfterViewInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scroll', { static: false }) scrollRef: any;

  [x: string]: any;
  user = {};
  topics = [];
  replies = [];
  isAjax = false;
  isLoading = true;

  constructor(@Inject('shaw') $shaw, @Inject('share') private share$, private $router: Router, private $route: ActivatedRoute) {
    Object.assign(this, $shaw);
  }

  ngOnInit() {
    this.handleFetchData();
  }

  ngAfterViewInit() {
    this.share$user = this.share$.user.subscribe(() => {
      clearTimeout(this.timerRefresh);
      this.timerRefresh = setTimeout(() => {
        clearTimeout(this.timerRefresh);
        this.scrollRef.handleRefresh();
      }, 310);
    });
  }

  ngOnDestroy() {
    this.share$user.unsubscribe();
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
        url: `${this.$api.user}/${this.$route.snapshot.params.name}`
      });
      this.isAjax = false;

      if (res.success) {
        this.isLoading = false;
        this.user = res.data;
        this.topics = res.data.recent_topics;
        this.replies = res.data.recent_replies;
        this.share$.handleSetUser({ user: this.user, topics: this.topics, replies: this.replies });
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
