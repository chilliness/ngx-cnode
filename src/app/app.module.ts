import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import qs from 'qs';
import axios from 'axios';
import BScroll from 'better-scroll';
import api from './utils/api';
const moment = require('moment');
moment.locale('zh-cn');
// axios请求拦截器
axios.interceptors.request.use(req => {
  if (req.data) {
    req.method = 'post';
    req.data.accesstoken = 'cdede16e-538e-4827-871d-008f3bfa384d';
    req.data = qs.stringify(req.data);
  }
  return req;
});
// axios响应拦截器
axios.interceptors.response.use(res => res.data);

import { AppRoutingModule, RouteAuth } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { TopicComponent } from './pages/topic/topic.component';
import { UserComponent } from './pages/user/user.component';
import { CollectComponent } from './pages/collect/collect.component';

import { HeaderComponent } from './components/header/header.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ToastComponent } from './components/toast/toast.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { ScrollComponent } from './components/scroll/scroll.component';

// 数据共享
import { ShareService } from './utils/share.service';

// 状态管理
import { StoreModule } from '@ngrx/store';
import { appReducer } from './app.store';

// 路由缓存
import { RouteReuseStrategy } from '@angular/router';
import { AppRoutingCache } from './app-routing.cache';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TopicComponent,
    UserComponent,
    CollectComponent,
    HeaderComponent,
    LoadingComponent,
    ToastComponent,
    ConfirmComponent,
    ScrollComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({ state: appReducer })
  ],
  providers: [
    RouteAuth,
    { provide: 'shaw', useValue: { $api: api, $http: axios, $BScroll: BScroll, $moment: moment } },
    { provide: 'share', useClass: ShareService },
    { provide: RouteReuseStrategy, useClass: AppRoutingCache }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
