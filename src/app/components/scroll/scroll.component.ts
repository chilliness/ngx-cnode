import { Component, OnInit, AfterViewInit, Inject, Input, Output, EventEmitter, ViewChild } from '@angular/core';

@Component({
  selector: 'app-scroll',
  templateUrl: './scroll.component.html',
  styleUrls: ['./scroll.component.scss']
})
export class ScrollComponent implements OnInit, AfterViewInit {
  @Input() data = [];
  @Input() click = true;
  @Input() probeType = 3;
  @Input() observeDOM = false;
  @Input() pullDownRefresh: boolean | object = false;
  @Input() pullUpLoad: boolean | object = false;
  @Input() delay = 300;
  @Input() isHome = false;

  @Output() scrolled = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() loaded = new EventEmitter();

  @ViewChild('scrollBox', { static: false }) scrollBoxRef: any;
  @ViewChild('refresh', { static: false }) refreshRef: any;

  [x: string]: any;
  refreshConfig = {
    flag: false,
    text: '下拉刷新'
  };
  loadConfig = {
    flag: true,
    text: '上拉加载数据'
  };

  constructor(@Inject('shaw') $shaw, @Inject('share') private share$) {
    Object.assign(this, $shaw);
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.handleInitScroll();
  }

  handleInitScroll() {
    if (!this.scroll) {
      this.scroll = new this.$BScroll(this.scrollBoxRef.nativeElement, {
        click: this.click,
        probeType: this.probeType,
        observeDOM: this.observeDOM,
        pullDownRefresh: this.pullDownRefresh,
        pullUpLoad: this.pullUpLoad
      });

      this.scroll.on('scroll', pos => {
        this.scrolled.emit(pos);

        if (this.pullDownRefresh) {
          const height = this.refreshRef.nativeElement.clientHeight;

          if (pos.y < 10) {
            this.refreshConfig.text = '下拉刷新';
          }

          this.refreshRef.nativeElement.style.top = `${Math.min(
            pos.y - height,
            height
          )}px`;
        }
      });

      if (this.pullDownRefresh) {
        this.scroll.on('pullingDown', () => {
          this.refreshConfig.flag = true;
          this.refresh.emit();
        });
      }

      if (this.pullUpLoad) {
        this.scroll.on('pullingUp', () => {
          this.loadConfig.flag = true;
          this.loaded.emit();
        });
      }
    } else {
      this.handleRefresh();
    }
  }

  handleFinshPullDown(text = '刷新完毕') {
    if (this.scroll) {
      this.refreshConfig = { flag: false, text };
      this.timerPullDown = setTimeout(() => {
        clearTimeout(this.timerPullDown);
        this.scroll.finishPullDown();
      }, this.delay);
    }
  }

  handleFinshPullUp(bool = false) {
    if (this.scroll) {
      this.scroll.finishPullUp();
      this.loadConfig = {
        flag: false,
        text: bool ? '我是有底线的' : '上拉加载数据'
      };
    }
  }

  handleScrollTo() {
    this.scroll && this.scroll.scrollTo(0, 0, 100);
  }

  handleRefresh() {
    this.scroll && this.scroll.refresh();
  }

  handleBy(index) {
    return index;
  }
}
