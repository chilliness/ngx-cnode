import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class RouteguardService implements CanActivate {

  constructor(private $router: Router) { }

  // 返回值 true: 跳转到当前路由 false: 不跳转到当前路由
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // 当前路由名称
    const path = route.routeConfig.path;

    if ((path == 'message' || path == 'topics') && (sessionStorage.logined != 1)) {
      this.$router.navigate(['login']);
      return false;
    } else if (path == 'login' && sessionStorage.logined == 1) {
      // 已登录，跳转到home
      this.$router.navigate(['home']);
      return false;
    } else {
      return true;
    }
  }
}
