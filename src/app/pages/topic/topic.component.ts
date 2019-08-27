import { Component, AfterViewInit, Inject, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements AfterViewInit {
  @ViewChild('message', { static: false }) messageRef: any;

  [x: string]: any;
  title = '详情';
  article = {};
  isAjax = false;
  isLoading = true;
  top = require('./img/top.gif');
  good = require('./img/good.gif');

  constructor(@Inject('shaw') $shaw, @Inject('share') private share$, private $router: Router, private $route: ActivatedRoute) {
    Object.assign(this, $shaw);
  }

  ngAfterViewInit() {
    this.handleFetchData();
  }

  handleFormatTime(time) {
    return this.$moment(time, 'YYYYMMDD')
      .fromNow()
      .replace(/\s/g, '');
  }

  handleUpdateTitle() {
    if (this.messageRef.nativeElement) {
      const obj = this.messageRef.nativeElement.getBoundingClientRect();
      this.title = obj.top > 50 ? '详情' : '留言';
    }
  }

  async handleFetchData() {
    if (this.isAjax) {
      return;
    }

    try {
      this.isAjax = true;
      const res = await this.$http({
        url: `${this.$api.topic}/${this.$route.snapshot.params.id}`
      });
      this.isAjax = false;

      if (res.success) {
        this.isLoading = false;
        this.article = res.data;
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
