import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpService } from './service/http.service';
import { RouteguardService } from './service/routeguard.service';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MessageComponent } from './components/message/message.component';
import { TopicComponent } from './components/topic/topic.component';
import { TopicsComponent } from './components/topics/topics.component';
import { UserComponent } from './components/user/user.component';
import { HeaderComponent } from './base/header/header.component';
import { TopComponent } from './base/top/top.component';
import { LoadingComponent } from './base/loading/loading.component';
import { ScrollComponent } from './base/scroll/scroll.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    MessageComponent,
    TopicComponent,
    TopicsComponent,
    UserComponent,
    HeaderComponent,
    TopComponent,
    LoadingComponent,
    ScrollComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [HttpService, RouteguardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
