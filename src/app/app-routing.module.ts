import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule, CanActivate, Router } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TopicComponent } from './pages/topic/topic.component';
import { UserComponent } from './pages/user/user.component';
import { CollectComponent } from './pages/collect/collect.component';
import session from './utils/storage';

// 路由拦截
@Injectable()
export class RouteAuth implements CanActivate {
  constructor(private $router: Router) { }

  canActivate() {
    // 此处做权限拦截
    if (!session.get('isLogin', 0)) {
      return this.$router.navigate(['/home']);
    }
    return true;
  }
}

const routes: Routes = [
  { path: 'home', component: HomeComponent, data: { keep: true } },
  { path: 'topic/:id', component: TopicComponent },
  { path: 'user/:name', component: UserComponent },
  { path: 'collect/:name', component: CollectComponent, canActivate: [RouteAuth] },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
