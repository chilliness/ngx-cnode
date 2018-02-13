import { Component, OnInit, Input, Output, ViewChild, ElementRef, AfterViewInit, EventEmitter } from '@angular/core';
declare let require: any;
const BScroll = require('better-scroll').default;

@Component({
  selector: 'app-scroll',
  templateUrl: './scroll.component.html',
  styleUrls: ['./scroll.component.scss']
})
export class ScrollComponent implements OnInit, AfterViewInit {

  @ViewChild('scroller') scroller: ElementRef;
  @ViewChild('refresher') refresher: ElementRef;

  @Input() data = [];
  @Input() click = true;
  @Input() probeType = 3;
  @Input() listenScroll = true;
  @Input() pullDownRefresh: boolean | Object = false;
  @Input() pullUpLoad: boolean | Object = false;
  @Input() bufferTime = 300;
  @Input() isPullOver = false;
  @Input() isLoading = { loadFlag: false };

  @Output() scroll = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() load = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.onInitScroll();
    }, this.bufferTime);
  }

  onLoadText() {
    const more = (this.pullUpLoad && this.pullUpLoad['txt'] && this.pullUpLoad['txt']['more']) || '加载更多';
    const noMore = (this.pullUpLoad && this.pullUpLoad['txt'] && this.pullUpLoad['txt']['noMore']) || '暂无数据';

    return this.isPullOver ? noMore : more;
  }

  onInitScroll() {
    if (!this['scrollY']) {
      this['scrollY'] = new BScroll(this.scroller.nativeElement, {
        probeType: this.probeType,
        click: this.click,
        pullDownRefresh: this.pullDownRefresh,
        pullUpLoad: this.pullUpLoad
      });

      if (this.listenScroll) {
        this['scrollY'].on('scroll', pos => {
          this.scroll.emit(pos);

          if (this.pullDownRefresh) {
            const num = Math.min(pos.y - 50, this.refresher.nativeElement.clientHeight);
            this.refresher.nativeElement.style.top = num + 'px';
          }
        });
      }

      if (this.pullDownRefresh) {
        this['scrollY'].on('pullingDown', () => {
          this.refresh.emit();
        });

        this['scrollY'].on('scrollEnd', pos => {
          if (pos.y >= 0) {
            this.isLoading['refreshFlag'] = true;
          }
        });
      }

      if (this.pullUpLoad) {
        this['scrollY'].on('pullingUp', () => {
          this.load.emit();
        });
      }
    } else {
      this.onRefresh();
    }
  }

  onDisable() {
    if (this['scrollY']) {
      this['scrollY'].disable();
    }
  }

  onEnable() {
    if (this['scrollY']) {
      this['scrollY'].enable();
    }
  }

  onRefresh() {
    if (this['scrollY']) {
      this['scrollY'].refresh();
    }
  }

  onScrollTo() {
    if (this['scrollY']) {
      this['scrollY'].scrollTo.apply(this['scrollY'], arguments);
    }
  }

  onScrollToElement() {
    if (this['scrollY']) {
      this['scrollY'].scrollToElement.apply(this['scrollY'], arguments);
    }
  }

  onFnishPullDown() {
    this.isLoading['refreshFlag'] = false;
    this['scrollY'].finishPullDown();
  }

  onFnishPullUp() {
    this.isLoading['loadFlag'] = false;
    this['scrollY'].finishPullUp();
  }

}
