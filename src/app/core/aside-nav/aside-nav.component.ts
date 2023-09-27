import { Component, OnInit, Input } from '@angular/core';
import * as $ from 'jquery';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { DataService } from 'src/app/service/data.service';
@AutoUnsubscribe()
@Component({
  selector: 'app-aside-nav',
  templateUrl: './aside-nav.component.html',
  styleUrls: ['./aside-nav.component.scss'],
})
export class AsideNavComponent implements OnInit {

  isShown: boolean;
  isShown2: boolean;
  sidenavshow: boolean;
  currentUser: any;
  permissionObject: any = null;
  permissionObj: any = null;
  isUserAccounts: boolean;
  isLogs: boolean;
  isAcs:boolean;
  apiIntegration:boolean;
  constructor(private dataService: DataService) {
    this.dataService.currentUser.subscribe((response) => {
      this.currentUser = response;
    });
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions;
    });
  }

  ngOnInit() {
    this.isShown = true;
    this.isShown2 = false;
    this.sidenavshow = true;
  }
  toggleShow() {
    this.isShown = !this.isShown;
  }

  toggleShowsidebar() {
    this.sidenavshow = !this.sidenavshow;
    if (!this.sidenavshow) {
      $('.sideNav').css('width', '82px');
      // $('.side-container').css('margin-left', '82px').slideLeft();
      $('.side-container').addClass('wl_82');
    }
    else {
      $('.sideNav').css('width', '210px');
      // $('.side-container').css('margin-left', '210px');
      $('.side-container').removeClass('wl_82');

    }
  }
  ShowsidebarMob() {
    if (window.innerWidth <= 575) {
      $('.sideNav').css('width', '0');
      $('.side-container').css('margin-left', '0');
      $('.overlay').css('display', 'none');
    }
  }
  toggleLogs() {
    this.isLogs = !this.isLogs;
  }
  toggleAcsSettings(){
    this.isAcs = !this.isAcs;
  }
  toggleApiIntegrationSettings(){
    this.apiIntegration = !this.apiIntegration;
  }
  ngOnDestroy(): void {
  }
}
