import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { validateEmailFormControl, CommonFunction } from 'src/app/shared/common';
import { DataService } from 'src/app/service/data.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import {
  CountryISO,
  SearchCountryField,
  PhoneNumberFormat,
} from 'ngx-intl-tel-input';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  activeForm =1;
  forgotForm: FormGroup;
  formErrors = {
    error: null,
    success: null
  };
  showLoader = false;
  currentCompany: any = null;
  loginType = 'email';
  submitted:boolean;
  
  SearchCountryField = SearchCountryField;
  PhoneNumberFormat = PhoneNumberFormat;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Singapore];
  selectedCountryISO = CountryISO.Singapore;
  mySelectedCountryISO: CountryISO;
  constructor(
    private router: Router,
    private authService: AuthService,
    private fBuilder: FormBuilder,
    private dataService: DataService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {
    this.forgotForm = this.fBuilder.group({
      UserName: [null, Validators.compose([Validators.required])],
      MobileNo: [null, Validators.compose([Validators.required])],
    });
  }

  ngOnInit() { }
  goBack(){
    this.router.navigateByUrl('/login');
  }
  submitForm(): void {
    this.submitted = true
    if (this.forgotForm.valid) {
      this.showLoader = true;
      const formData = {
        UserName: this.forgotForm.value.UserName,
        MobileNo: this.forgotForm.value.MobileNo?.e164Number,
      };
      this.authService.forgotPassword(formData).subscribe((response) => {
        this.showLoader = false;
        if(response?.status=="Error"){
          this.toastr.error(response.message)
        }
        if (response?.status != "Error") {
          this.dataService.getMobileNoSubject.next(response?.data);
          this.dataService.getForgotFormSubject.next(this.forgotForm?.value);
          this.router.navigateByUrl('/verification');
          setTimeout(() => { CommonFunction.resetForm(this.forgotForm); }, 3000);
        } else {
          this.toastr.error(response.message)
          this.formErrors.error = `* ${response.message}`;
          this.showLoader = false;
        }
      },
        (error) => {
          this.toastr.error(error.error.message)
          this.formErrors.error = `* ${error.error.message}`;
          this.showLoader = false;
        }
      );
    }
  }
  submitForm2(){
    
  }
  submitForm3(){
    
  }
  changesform(val : number){
     this.activeForm = val;
     this.router.navigateByUrl('/verification');
  }
}
