import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import { VmsStationService } from 'src/app/service/vms-station.service';
import { emailRegEx } from 'src/app/shared/common';
import { MYCustomValidators } from '../../profile/custom-validators';
import {
  CountryISO,
  SearchCountryField,
  PhoneNumberFormat,
} from 'ngx-intl-tel-input';
import { UseraccountService } from 'src/app/service/useraccount.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-vms-station-add',
  templateUrl: './vms-station-add.component.html',
  styleUrls: ['./vms-station-add.component.scss']
})
export class VmsStationAddComponent implements OnInit {

  addForm: FormGroup;
  showLoader = false;
  isEditing = false;
  editId = null;
  submitted: boolean;
  hide = true;
  currentUser: any;
  SearchCountryField = SearchCountryField;
  PhoneNumberFormat = PhoneNumberFormat;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Singapore];
  selectedCountryISO = CountryISO.Singapore;
  mySelectedCountryISO: CountryISO;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private stationService: VmsStationService,
    private dataservice: DataService,
    private useraccountService: UseraccountService,
    private toastr: ToastrService,
    private translateService: TranslateService,
  ) {

    this.dataservice.currentUser.subscribe((responce) => {
      if (responce){
        this.currentUser = responce;
      }
    });

    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
      if (this.isEditing) { this.getEditObject(); }
    }

  this.addForm = this.fb.group({
    stationName: ["", Validators.compose([Validators.required])],
    userName: ["", Validators.compose([Validators.required])],
    password:["", [
      Validators.required,
      // check whether the entered password has a number
      MYCustomValidators.patternValidator(/\d/, { hasNumber: true }),
      // check whether the entered password has upper case letter
      MYCustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
      // check whether the entered password has a lower case letter
      MYCustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
      // check whether the entered password has a special character
      MYCustomValidators.patternValidator(
        /^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/,
        { hasSpecialCharacters: true }
      ),
      Validators.minLength(14),
    ]],
    email: ["", Validators.compose([Validators.required, Validators.pattern(emailRegEx)])],
    mobileNo: ["", Validators.compose([Validators.required])],
    roleName: ["Work Station", Validators.compose([])],
    roleId: ["4", Validators.compose([])],
    userStatus:[""],
    show_T_C: [false, Validators.compose([Validators.required])],
  });

  }

  ngOnInit(): void {
  }

  getEditObject() {
    this.showLoader = true;
    this.stationService.GetStationById(this.editId).subscribe((response) => {
      if (response) {
        this.showLoader = false;
        let mobileNo = response?.data?.mobileNo.substring(3,11);
        var password = atob(response?.data?.password)
        this.addForm.patchValue(response?.data);
        this.addForm.patchValue({
          password:password,
          mobileNo:mobileNo
        })
      } else {
        this.router.navigateByUrl('/vms-station');
      }
    });
  }


  submitForm() {
    this.submitted = true
      this.showLoader = true;
      if (this.addForm.valid) {
        let payload=this.addForm.value
        if (this.isEditing) {
          
          payload['id']=this.editId
          payload['mobileNo']=this.numberstr(this.addForm?.value?.mobileNo?.e164Number)
          this.stationService.saveStation(payload).subscribe(
            (response) => {
              this.showLoader = false;
              if (response) {
                this.toastr.success(
                  this.translateService.instant('VALIDATE.VMS_UPDATED')
                );
                this.router.navigateByUrl('/vms-station');
              } else {
              }
            },
            (error) => {
              this.showLoader = false;
            }
          );
        } else {
          if (this.addForm.valid) {
            payload['mobileNo']=this.numberstr(this.addForm?.value?.mobileNo?.e164Number)
            this.stationService.saveStation(this.addForm.value).subscribe(
              (response) => {
                this.showLoader = false;
                if(response?.status=="Error"){
                  this.toastr.error(response?.data);
                }else  {
                  if(response?.status=="Ok"){
                    this.toastr.success(
                      this.translateService.instant('VALIDATE.VMS_SUCCESS')
                    );
                    this.router.navigateByUrl('/vms-station');
                  }
                }
              },
              (error) => {
                this.showLoader = false;
              }
            );
          }
        }
      }


  }

  // submitForm() {
  //   this.submitted = true
  //     this.showLoader = true;
  //     let payLoad=this.addForm.value
  //     if (this.isEditing) {
      
  //       const payload2 = {
  //         userName: this.addForm.value?.userName,
  //         email:this.addForm.value?.email,
  //         userGuid:this.addForm.value?.userGuid,
  //         roleId:this.addForm.value?.roleId,
  //         roleName:this.addForm.value?.roleName,
  //         show_T_C:this.addForm.value?.show_T_C,
  //       }
  //       payload2['id']=this.editId
  //       payload2['mobileNo']=this.numberstr(this.addForm?.value?.mobileNo?.e164Number)
  //       payload2['userStatus']=this.numbertoBoolean2(this.addForm?.value?.userStatus)
  //       // payload2['show_T_C']=this.numbertoBoolean(this.addForm?.value?.show_T_C)
  //       this.useraccountService.saveUserAccount(payload2)
  //         .subscribe(
  //           (response) => {
  //             this.showLoader = false;
  //             if (response?.status == 'Ok') {
                
  //               this.toastr.success(
  //                 this.translateService.instant('VALIDATE.VMS_UPDATED')
  //               );
  //               this.router.navigateByUrl('/vms-station');
  //             } else {
  //             }
  //           },
  //           (error) => {
  //             this.showLoader = false;
  //           }
  //         );
  //     } else {
  //       if (this.addForm.valid) {
  //         // payLoad['roleId']=this.numberstr(this.addForm.value?.roleId),
  //         payLoad['mobileNo']=this.numberstr(this.addForm?.value?.mobileNo?.e164Number)
  //         payLoad['userStatus']=this.numbertoBoolean(this.addForm?.value?.userStatus)
  //         // payLoad['show_T_C']=this.numbertoBoolean(this.addForm?.value?.show_T_C)
  //         this.useraccountService.saveUserAccount(this.addForm.value).subscribe(
  //           (response) => {
  //             this.showLoader = false;
  //             if (response.status == 'Error') {
  //               this.toastr.error(response?.data);
  //               // this.router.navigateByUrl('/user-account');
  //             } else {
  //               // this.toastr.success(response?.message);
  //               this.toastr.success(
  //                 this.translateService.instant('VALIDATE.VMS_SUCCESS')
  //               );
  //               this.router.navigateByUrl('/vms-station');
  //             }
  //           },
  //           (error) => {
  //             this.showLoader = false;
  //           }
  //         );
  //       }

  //     }
    
  // }

  numberstr(phone){
    let number = phone?.toString();
    return number;
  }

  numbertoBoolean(phone){ 
    let boolValue = JSON.parse("true");
    return boolValue;
  }
  numbertoBoolean2(phone){ 
    let boolValue = JSON.parse(phone);
    return boolValue;
  }

}
