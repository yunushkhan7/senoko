import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/service/data.service';
import { RoleService } from 'src/app/service/role.service';
import { UseraccountService } from 'src/app/service/useraccount.service';
import { decryptValue, emailRegEx, validateEmailFormControl } from 'src/app/shared/common';
import { MYCustomValidators } from '../../profile/custom-validators';
import * as CryptoJS from 'crypto-js';
import {
  CountryISO,
  SearchCountryField,
  PhoneNumberFormat,
} from 'ngx-intl-tel-input';
import { Country } from 'ngx-intl-tel-input/lib/model/country.model';

@Component({
  selector: 'app-user-account-add',
  templateUrl: './user-account-add.component.html',
  styleUrls: ['./user-account-add.component.scss']
})
export class UserAccountAddComponent implements OnInit {
  addForm: FormGroup;
  showLoader = false;
  isEditing = false;
  editId = null;
  roleList: any = [];
  hide = true;
  hide1 = true;
  hide2 = true;
  selectedroleList: Array<any> = [];
  submitted: boolean;
  currentUser: any;
  role:any;
  userId:any;
  StatusList:any=[
    {
      Status: 'Active',
      StatusCode: true,
    },
    {
      Status: 'Blocked',
      StatusCode: false,
    },
  ];
  status:any;
  // @ViewChild('mobileNo')
  // public mobileNo;

  SearchCountryField = SearchCountryField;
  PhoneNumberFormat = PhoneNumberFormat;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Singapore];
  selectedCountryISO = CountryISO.Singapore;
  mySelectedCountryISO: CountryISO;

  selectedRoleName:any;

  constructor(
    private fb: FormBuilder,
    private useraccountService: UseraccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private roleService: RoleService,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private dataservice: DataService,
    ) {


      if (this.activatedRoute.snapshot.paramMap.get('id')) {
        this.isEditing = true;
        this.editId = this.activatedRoute.snapshot.paramMap.get('id');
        if (this.isEditing) { this.getEditObject(); }
      }


    this.addForm = this.fb.group({
      firstName: ["", Validators.compose([])],
      userName: ["", Validators.compose([Validators.required])],
      lastName: ["", Validators.compose([])],
      // password: ["", Validators.compose([Validators.required])],
      password: [null, [
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
      userGuid: ["", Validators.compose([])],
      address: ["", Validators.compose([])],
      roleName: ["", Validators.compose([])],
      roleId: ["", Validators.compose([Validators.required])],
      profileImage:["", Validators.compose([])],
      // lastLoginOn: ["", Validators.compose([])],
      // isFirstLogin: [true, Validators.compose([])],
      userStatus:[""],
      show_T_C: ["", Validators.compose([])],
    });

    this.dataservice.currentUser.subscribe((responce) => {
      if (responce){
        this.currentUser = responce;
      }
    });
  }

  ngOnInit(): void {
    this.getAllRoles()
  }
  // public ngAfterViewChecked() {
  //     // disabling country selection button
  //       try {
  //         this.mobileNo.elRef.nativeElement.firstChild.children[0].disabled = 'true';
  //       } catch (e) {
  //         // ignore this
  //       }
  // }
  
  hideShow(){
    if (this.status == true && this.isEditing){
      this.hide = this.hide
      this.addForm.valueChanges.subscribe((isEditing) => {
        this.isEditing = !this.addForm.dirty;
      });
    }
  }
  getAllRoles() {
    this.roleService.getRoleList({}).subscribe((response: any) => {
      this.roleList = response.data
    })
  }

  getEditObject() {
    this.showLoader = true;
    this.useraccountService.GetUserAccountById(this.editId).subscribe((response) => {
      if (response) {
        let mobileNo = response?.data?.mobileNo.substring(3,11); 
        this.userId = response?.data?.id
        // var password = atob(response?.data?.password)
        this.status = response?.data?.userStatus
        this.role = response?.data?.roleName.replace(/\s/g, "")
        this.addForm.get('password').markAsDirty();
        this.showLoader = false;
        this.addForm.patchValue(response?.data);
        this.addForm.patchValue({
          // password:password,
          mobileNo:mobileNo
        })
      } else {
        this.router.navigateByUrl('/user-account');
      }
    });
  }

  roleSelect(role){
    this.selectedRoleName = role?.roleName
  }


  submitForm() {
    this.submitted = true
      this.showLoader = true;
      let payLoad=this.addForm.value
      payLoad['roleName']=this.roleList.filter(c=>c.id==this.addForm.value.roleId)[0]?.roleName
      if (this.isEditing) {
      
        const payload2 = {
          userName: this.addForm.value?.userName,
          email:this.addForm.value?.email,
          userGuid:this.addForm.value?.userGuid,
          roleId:this.addForm.value?.roleId,
          roleName:this.roleList.filter(c=>c.id==this.addForm.value.roleId)[0]?.roleName,
          show_T_C:this.addForm.value?.show_T_C,
        }
        payload2['id']=this.editId
        payload2['mobileNo']=this.numberstr(this.addForm?.value?.mobileNo?.e164Number)
        payload2['userStatus']=this.numbertoBoolean2(this.addForm?.value?.userStatus)
        // payload2['show_T_C']=this.numbertoBoolean(this.addForm?.value?.show_T_C)
        this.useraccountService.saveUserAccount(payload2)
          .subscribe(
            (response) => {
              this.showLoader = false;
              if (response?.status == 'Ok') {
                
                this.toastr.success(
                  this.translateService.instant('VALIDATE.SUCCESS')
                );
                this.router.navigateByUrl('/user-account');
              } else {
              }
            },
            (error) => {
              this.showLoader = false;
            }
          );
      } else {
        if (this.addForm.valid) {
          payLoad['mobileNo']=this.numberstr(this.addForm?.value?.mobileNo?.e164Number)
          payLoad['userStatus']=this.numbertoBoolean(this.addForm?.value?.userStatus)
          payLoad['show_T_C']=this.numbertoBoolean(this.addForm?.value?.show_T_C)
          this.useraccountService.saveUserAccount(this.addForm.value).subscribe(
            (response) => {
              this.showLoader = false;
              if (response.status == 'Error') {
                this.toastr.error(response?.data);
                // this.router.navigateByUrl('/user-account');
              } else {
                this.toastr.success(response?.message);
                this.router.navigateByUrl('/user-account');
              }
            },
            (error) => {
              this.showLoader = false;
            }
          );
        }

      }
    
  }

  numberstr(phone){
    let number = phone.toString();
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
