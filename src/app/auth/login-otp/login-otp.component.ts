import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { DataService } from 'src/app/service/data.service';
import { ChangePasswordComponentPopup } from 'src/app/core/change-password-popup/change-password-popup.component';

@Component({
  selector: 'app-login-otp',
  templateUrl: './login-otp.component.html',
  styleUrls: ['./login-otp.component.scss']
})
export class LoginOtpComponent implements OnInit {

  otpForm: FormGroup;
  forgatAuth: any = null;
  showLoader = false;
  formErrors = {
    apierror: null
  };
  editId = null;
  currentUser: any;
  userMobile:any;
  newString: any;
  display: any;
  finished = false
  loginRes: any;
  constructor(
    private router: Router,
    private fBuilder: FormBuilder,
    private dataService: DataService,
    private toastr: ToastrService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {
    this.otpForm = this.fBuilder.group({
      UserGuid: [null],
      loginotp: [null, Validators.compose([Validators.required, Validators.minLength(6)])]
    });
    this.dataService.currentUser.subscribe((responce) => {
      if (responce){
        this.currentUser = responce;
        this.userMobile = responce?.mobileNo;
        this.newString = this.mask(this.userMobile)
        this.editId = this.currentUser?.userGuid;
      }

    });
    this.timer(2);
    this.dataService.userResponce.subscribe((res)=>{
      if (res){
        this.loginRes = res;
      }
    })
  }

  ngOnInit() {
  }

  onOtpChange(data) {
    this.otpForm.patchValue({ otp: data })
  }

  mask(str) {
    const first = str.substring(0, 2);
    const last = str.substring(str.length - 3);
    const mask = str.substring(0, str.length - 3).replace(/\d/g, "*");
    return mask + last;
  }
  
  submitForm(): void {
    if (this.otpForm.valid) {
      this.showLoader = true;
      const otpData = {
        UserGuid: this.editId,
        otp: this.otpForm.value.loginotp,
      };
      this.authService.login_Otp(otpData).subscribe((response) => {
        this.showLoader = false;
        if(response?.status == 'Error'){
          this.toastr.error('Invalid OTP');
        }else{
          if(response){
            if (response?.permissions && response?.permissions?.length) {
              this.dataService.currentUserSubject.next(response?.user);
              this.dataService.getloginreauthenticateSubject.next(response);
              this.dataService.setAuth(response);
              this.router.navigateByUrl('/dashboard');
              if (response?.user?.isFirstLogin || response?.user?.passwordchange==true) {
                const dialogRef = this.dialog.open(ChangePasswordComponentPopup, {
                  disableClose: true,
                  data: response,
                  panelClass: 'delete-popup'
                });
                dialogRef.afterClosed().subscribe(result => {
                  if (result && result.is_delete) {
                    // ChangePasswordComponentPopup close action callback
                  }
                });
              }
            } else {
              this.toastr.warning('please contact to administration.', 'Permission Denied');
            }
          }
        }
      }, (error) => {
        this.toastr.error(error.message);
        this.showLoader = false;
      });
    }
  }

  changesform(){
    // this.activeForm = val;
    this.router.navigateByUrl('/reset-password');
  }

  timer(minute) {
    // let minute = 1;
    let seconds: number = minute * 60;
    let textSec: any = "0";
    let statSec: number = 60;

    const prefix = minute < 10 ? "0" : "";

    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        this.finished = true
        clearInterval(timer);
      }
    }, 1000);
  }
  sendagain(){
    this.finished = false
    this.authService.login(this.loginRes).subscribe((response) => {
      this.showLoader = false;
      if(response){
        if (response?.permissions && response?.permissions?.length) {
          this.dataService.currentUserSubject.next(response?.user);
          this.dataService.setAuth(response);
          
        }
      }
    }, (error) => {
      this.toastr.error(error.message);
      this.showLoader = false;
    });
    this.timer(2);
  }

  goBack(){
    this.router.navigateByUrl('/login');
  }
  
}
