import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteguardService } from './service/routeguard.service';

import { HomeComponent } from './components/home/home.component';
import { TopicComponent } from './components/topic/topic.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/login/login.component';
import { MessageComponent } from './components/message/message.component';
import { TopicsComponent } from './components/topics/topics.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'topic/:id',
    component: TopicComponent
  },
  {
    path: 'user/:loginname',
    component: UserComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'message',
    component: MessageComponent,
    canActivate: [RouteguardService]
  },
  {
    path: 'topics',
    component: TopicsComponent,
    canActivate: [RouteguardService]
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
