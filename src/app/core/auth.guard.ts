import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonServicesService } from '../services/common-services.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private commonService: CommonServicesService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    if (!this.commonService.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      this.commonService.deleteToken();
      return false;
    }
    return true;
  }

}
