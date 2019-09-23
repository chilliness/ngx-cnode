import { Component, AfterViewInit, Inject, Input, Output, EventEmitter, ViewChild } from '@angular/core';

@Component({
  selector: 'app-scroll',
  templateUrl: './scroll.component.html',
  styleUrls: ['./scroll.component.scss']
})
export class ScrollComponent implements AfterViewInit {
  @Input() data = [];
  @Input() click = true;
  @Input() probeType = 3;
  @Input() observeDOM = false;
  @Input() pullDownRefresh: boolean | object = false;
  @Input() pullUpLoad: boolean | object = false;
  @Input() delay = 300;
  @Input() isHome = false;

  @Output() emitScroll = new EventEmitter();
  @Output() emitRefresh = new EventEmitter();
  @Output() emitLoad = new EventEmitter();

  @ViewChild('scrollBoxRef', { static: false }) scrollBoxRef: any;
  @ViewChild('refreshRef', { static: false }) refreshRef: any;

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

  ngAfterViewInit() {
    this.handleInitScroll();
  }

  handleInitScroll() {
    if (!this.scroll) {
      this['scroll'] = new this.$BScroll(this.scrollBoxRef.nativeElement, {
        click: this.click,
        probeType: this.probeType,
        observeDOM: this.observeDOM,
        pullDownRefresh: this.pullDownRefresh,
        pullUpLoad: this.pullUpLoad
      });

      this.scroll.on('scroll', pos => {
        this.emitScroll.emit(pos);

        if (this.pullDownRefresh) {
          const height = this.refreshRef.nativeElement.clientHeight;

          if (pos.y < 10) {
            this.refreshConfig.text = '下拉刷新';
          }

          this.refreshRef.nativeElement.style.top = `${Math.min(pos.y - height, height)}px`;
        }
      });

      if (this.pullDownRefresh) {
        this.scroll.on('pullingDown', () => {
          this.refreshConfig.flag = true;
          this.emitRefresh.emit();
        });
      }

      if (this.pullUpLoad) {
        this.scroll.on('pullingUp', () => {
          this.loadConfig.flag = true;
          this.emitLoad.emit();
        });
      }
    } else {
      this.handleRefresh();
    }
  }

  handleFinshPullDown(text = '刷新完毕') {
    if (this.scroll) {
      this.refreshConfig = { flag: false, text };
      setTimeout(() => {
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
    if (this.scroll) {
      this.scroll.scrollTo(0, 0, 100);
    }
  }

  handleRefresh() {
    if (this.scroll) {
      this.scroll.refresh();
    }
  }

  handleBy(index) {
    return index;
  }
}
