import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { DataService } from './service/data.service';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { JwtService } from './service/jwt.service';
import { CommonService } from './service/common.service';
import { filter, map } from 'rxjs/operators';
import { APP_NAME } from './shared/messages';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponentPopup } from './core/change-password-popup/change-password-popup.component';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { ActionPopupComponent } from './core/action-popup/action-popup.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  customConfig: any;
  isAuthenticated: boolean;
  previousUrl: string;
  currentUser: any;
  isRootPage: any;
  permissionObject: any = [];
  isLoader = false;
  reauthenticate:any;
  refretoken:any;
  constructor(
    private renderer: Renderer2,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private jwtService: JwtService,
    private dataService: DataService,
    private meta: Meta,
    private commonService: CommonService,
    public dialog: MatDialog,
    private location: Location
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (this.previousUrl) {
          this.renderer.removeClass(document.body, this.previousUrl);
        }
        const currentUrlSlug = event.url.slice(1);
        if (currentUrlSlug) {
          this.renderer.addClass(document.body, currentUrlSlug);
        }
        this.previousUrl = currentUrlSlug;
      }
    });

    if (this.jwtService.getToken()) {
        this.getProfile();
    }

    this.dataService.isAuthenticated.subscribe((isLoggedIn) => {
      this.isAuthenticated = isLoggedIn;
    });
    this.dataService.permission.subscribe((response) => {
      response && response.length > 0 ? this.permissionObject = response : '';
    });
    this.globalRouterEvents();

    this.dataService.reauthentiacteResponce.subscribe((responce) => {
      if (responce){
        this.currentUser = responce;
        this.reauthenticate=responce?.jwtToken;
        this.refretoken=responce?.refreshToken;
      }

    });
    // this.setTimeout();
    // this.userInactive.subscribe(() => console.log('user has been inactive for 3s'));
    commonService.idle$.subscribe(s => {
      console.log('im idle, zzz')
      // this.getreauthenticate();
    });
    commonService.wake$.subscribe(s =>  {
      this.onLogOut()
      //  this.getreauthenticate();
    });
  }

  globalRouterEvents(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    ).subscribe(() => {
      const rt = this.getChild(this.activatedRoute);
      rt.data.subscribe(data => {
        this.isRootPage = data && data.isRootPage;
        const title = data && data.title;
        const tags = data && data.tags;

        if (title) { this.titleService.setTitle(`${title} | ${APP_NAME}`); }
        if (tags) { tags.forEach((tag) => { this.meta.updateTag(tag); }); }
        //  check the Permission
        this.dataService.permission.subscribe((response: any) => {
          let role = response?.permissions;
          if (role && data['module'] && data['action']) {
            const checkPerms = role[data['module']] ? role[data['module']][data['action']] : false;
            if (!checkPerms) {
              this.location.back();
              return;
            }
          }
        });
      });
    });
  }

  onLogOut() {
    this.dataService.purgeAuth();
    const dialogRef = this.dialog.open(ActionPopupComponent, {
      width: '530px',
      height: '320px',
      data: { isSessionTimeOut: true },
      panelClass: 'timeout',
      disableClose: true,
    });
    this.router.navigateByUrl('/login');
  }
  getreauthenticate() {
    const params: any = {
      jwtToken: this.reauthenticate,
      refreshToken:  this.refretoken
    };
    this.commonService.ReAuthenticate(params).subscribe((response) => {
      if (response) {    
        this.dataService.setreAuth(response)
      }
      // if (response?.status !='Error') {
      //   this.dataService.purgeAuth();
      //   const dialogRef = this.dialog.open(ActionPopupComponent, {
      //     width: '530px',
      //     height: '320px',
      //     data: { isSessionTimeOut: true },
      //     panelClass: 'timeout',
      //     disableClose: true,
      //   });
      //   this.router.navigateByUrl('/login');
      // }
    }, (err) => {
    });
  }


  getProfile() {
    this.isLoader = true;
    this.commonService.GetCurrentUserProfile().subscribe((response) => {
      this.isLoader = false;
      if (response) {
        this.dataService.setAuth(response)
        this.dataService.getloginreauthenticateSubject.next(response);
        if (response.user.isFirstTimeLogin) {
          this.dialog.open(ChangePasswordComponentPopup, {
            disableClose: true,
            data: response,
            panelClass: 'delete-popup'
          });
        }
      }
    }, (err) => {
      this.dataService.purgeAuth();
      window.location.reload();
    });
  }

  getChild(activatedRoute: ActivatedRoute) {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }

  ngOnInit() { }

  // userActivity;
  // userInactive: Subject<any> = new Subject();



  // setTimeout() {
  //   this.userActivity = setTimeout(() => this.userInactive.next(undefined), 3000);
  // }

  // @HostListener('window:mousemove') refreshUserState() {
  //   clearTimeout(this.userActivity);
  //   this.setTimeout();
  // }

}
