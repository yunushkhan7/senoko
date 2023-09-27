import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { validateEmailFormControl } from 'src/app/shared/common';
import { DataService } from 'src/app/service/data.service';
import { ToastrService } from 'ngx-toastr';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponentPopup } from 'src/app/core/change-password-popup/change-password-popup.component';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
@AutoUnsubscribe()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  formErrors = {
    apierror: null,
  };
  showLoader = false;
  isAuthenticated: boolean;
  isCompanySelected: boolean;
  loginType = 'email';
  captchaValue: string = '';
  hide = true;
  permissions: any;
  currentUser: any;
  submitted:boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private fBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: DataService,
    public dialog: MatDialog
  ) {
    this.loginForm = this.fBuilder.group({
      userName: [
        null,
        Validators.compose([Validators.required]),
      ],
      password: [null, Validators.compose([Validators.required])],
      captcha: [null, Validators.compose([Validators.required])],
      reCaptcha: [''],
    });
  }

  ngOnInit() {
    this.createCaptcha();
  }

  changeLoginType(type) {
    this.loginType = type;
  }

  getLoginType(type) {
    this.loginType = type;
  }

  submitForm(): void {
    if (this.formErrors.apierror) {
      if (
        this.loginForm.controls['captcha'].value !==
        this.loginForm.controls['reCaptcha'].value
      ) {
        this.createCaptcha();
        this.toastr.error('Please enter a valid captcha!!');
        return;
      }
    }
    this.submitted = true
    if (this.loginForm.valid) {
      this.showLoader = true;
      const formData = {
        userName: this.loginForm.value.userName,
        password: this.loginForm.value.password,
      };
      this.authService.login(formData).subscribe(
        (response) => {
          this.showLoader = false;
          if (response) {
            if (
              response?.message == 'Success' &&
              response?.permissions &&
              response?.permissions?.length
            ) {
              this.dataService.currentUserSubject.next(response?.user);
              this.dataService.getloginFormSubject.next(formData);
              // this.dataService.setAuth(response);
              // this.activatedRoute.snapshot.queryParamMap.get('next');

              // const nextURL = this.activatedRoute.snapshot.queryParamMap.get('next') ?
              this.router.navigateByUrl('/login-otp');
              // if (
              //   response?.user?.isFirstLogin ||
              //   response?.user?.passwordchange == true
              // ) {
              //   const dialogRef = this.dialog.open(
              //     ChangePasswordComponentPopup,
              //     {
              //       disableClose: true,
              //       data: response,
              //       panelClass: 'delete-popup',
              //     }
              //   );
              //   dialogRef.afterClosed().subscribe((result) => {
              //     if (result && result.is_delete) {
              //       // ChangePasswordComponentPopup close action callback
              //     }
              //   });
              // }
              // this.activatedRoute.snapshot.queryParamMap.get('/dashboard') ;
              // this.router.navigateByUrl(nextURL);
            }
            if (response?.status == 'NoRole') {
              this.toastr.error('User has no permission to access the module.');
            }
            if (response?.status == 'Error') {
              this.toastr.error('Invalid login credentials.');
            }
            if (response?.status == 'Blocked') {
              const dialogRef = this.dialog.open(ActionPopupComponent, {
                width: '530px',
                height: '320px',
                data: { Blocked: true },
                panelClass: 'timeout',
                disableClose: true,
              });
              dialogRef.afterClosed().subscribe(result => {
                if (result && result.is_delete) {
                  // ChangePasswordComponentPopup close action callback
                }
              });
            }
            // else {
            //   this.toastr.warning('please contact to administration.', 'Permission Denied');
            // }
          } else {
            this.formErrors.apierror = `* ${response.error[0]}`;
          }
        },
        (error) => {
          this.createCaptcha();
          this.toastr.error(error.error.message);
          this.formErrors.apierror = error.error.message;
          this.showLoader = false;
          this.loginForm
            .get('reCaptcha')
            .setValidators(Validators.compose([Validators.required]));
          this.loginForm.get('reCaptcha').updateValueAndValidity();
        }
      );
    }
  }
  removeError() {
    this.formErrors.apierror = null;
  }

  createCaptcha() {
    let result = '';
    let characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    this.captchaValue = result;
    this.loginForm.controls['captcha'].setValue(result);
    this.loginForm.controls['reCaptcha'].setValue('');
  }

  forgotPassword(){
    this.router.navigateByUrl('/forgot-password');
  }
  ngOnDestroy(): void {}
  typedcheck = false
  check(){
   this.typedcheck = !this.typedcheck
  }
}
