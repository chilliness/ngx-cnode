import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpService, $api } from '../../service/http.service';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {

  @ViewChild('textarea') textarea: ElementRef;

  title = '';
  isAjax = false;
  msg = '为防封号，默认发帖到灌水区';

  constructor(private $http: HttpService) { }

  ngOnInit() {
  }

  onRelease() {
    const title = this.title;
    const content = this.textarea.nativeElement.innerText;

    if (this.isAjax || title.replace(/\s/g, '').length < 10 || content.replace(/\s/g, '').length < 10) {
      return;
    }

    this.isAjax = true;
    this.msg = '';

    this.$http.post($api.topics, {
      accesstoken: sessionStorage.accesstoken,
      title,
      content,
      tab: 'dev'
    }).subscribe((res) => {
      if (res.success == $api.code) {
        this.title = '';
        this.textarea.nativeElement.innerText = '请输入内容，不少于十个字符';
        alert('创建话题成功，可前往官网查看');
      }
      this.isAjax = false;
    }, () => {
      this.msg = $api.tip;
      this.isAjax = false;
    });
  }

}
