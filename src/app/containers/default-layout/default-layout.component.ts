import {Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonServicesService } from '../../services/common-services.service';
import { navItems } from '../../_nav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {

  constructor(private router: Router,
    private commonService: CommonServicesService) { }
    
  public sidebarMinimized = false;
  public navItems = navItems;

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }
  logOut() {
    this.router.navigateByUrl('/login');
    this.commonService.deleteToken();
  }
}