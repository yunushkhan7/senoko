import { Component, OnInit } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { DataService } from 'src/app/service/data.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';
import { PasswordValidation } from 'src/app/shared/common';
import { emailRegEx } from 'src/app/shared/common';
// import { CommonService } from 'src/app/service/common.service';
import { TranslateService } from '@ngx-translate/core';
import { MYCustomValidators } from './custom-validators';
import { RoleService } from 'src/app/service/role.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  PageTitle = "Profile"
  currentUser: any;
  role:any;
  permissionObject: any = null;

  hide = true;
  hide1 = true;
  hide2 = true;
  loadingState = true;
  addForm: FormGroup;
  validationMessages: any;
  formErrors = {
    old_password: '',
    new_password: '',
    confirm_password: '',
    apierror: '',
    emailId: null,
  };
  submitAttempt = false;
  showLoader = false;
  addProfileForm: FormGroup;
  isEditing = false;
  editId = null;
  pageTitle = 'Update Profile';
  editObject: any;
  isProfileEditable: boolean = false;
  selectedProfileFile: any;
  selectedFile: any;
  url: any;
  base64textString:any;
  selectedProfileImage:any;
  submitted: boolean;
  id:any
  editImageUrl: any = null;
  defaultProfileImage = 'https://ebcblob.blob.core.windows.net/ebc/DefaultUser.png'
  roleList: any = [];

  constructor(
    private dataservice: DataService,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private toastService: ToastrService,
    private authService: AuthService,
    private roleService: RoleService,
   
    private translateService: TranslateService,
  ) {

    // this.addForm = fb.group({
    //   old_password: [null, Validators.compose([Validators.required])],
    //   new_password: [null, [
    //     Validators.required,
    //     // check whether the entered password has a number
    //     MYCustomValidators.patternValidator(/\d/, { hasNumber: true }),
    //     // check whether the entered password has upper case letter
    //     MYCustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
    //     // check whether the entered password has a lower case letter
    //     MYCustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
    //     // check whether the entered password has a special character
    //     MYCustomValidators.patternValidator(
    //       /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
    //       { hasSpecialCharacters: true }
    //     ),
    //     Validators.minLength(8),
    //   ]],
    //   confirm_password: [null, Validators.compose([Validators.required])],
    // }, {
    //   validator: MYCustomValidators.passwordValidation()
    // });

    this.addProfileForm = this.fb.group({
      userName: [""],
      fullName: ["",],
      email: [null, [Validators.pattern(emailRegEx)]],
      mobileNo:[""],
      lastName:[""],
      password:[""],
      roleName:[""],
      userGuid:[""],
      address:[""],
      roleId:[""],
      profileImage:[""]
    });
    this.dataservice.currentUser.subscribe((responce) => {
      if (responce){
        this.currentUser = responce;
        this.role = responce?.roleName.replace(/\s/g, "")
        this.editImageUrl = this.currentUser?.profileImage ? this.currentUser?.profileImage : this.defaultProfileImage;
        this.isEditing = true;
        this.editId = this.currentUser?.id;
        this.getEditObject();
      }

    });

    this.dataservice.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.Avatar;
    });
  }

  ngOnInit(): void {
    // this.addForm.markAsUntouched();
    this.getAllRoles();
  }


  fileChangeEvent(fileInput: any) {
    const reg = /(.*?)\.(jpg|jpeg|png|gif|giff)$/;
    if (!fileInput.target.files[0].name.match(reg)) {
      // this.toastService.showError(
      //   this.translateService.instant('ADMIN.SELECT')
      // );
      this.removeFile();
      return false;
    } else {
      this.removeFile();
      this.selectedFile = fileInput.target.files[0];
      var reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(this.selectedFile);
    }
  }
  removeFile() {
    this.selectedFile = null;
  }
  handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.base64textString = 'data:image/png;base64,' + btoa(binaryString);
  }


  getEditObject() {
    this.userService.getUserById({id: this.editId}).subscribe((response) => {
      this.showLoader = false;
      if (response?.data) {
        this.editObject = response?.data;
        this.base64textString = this.editObject?.profileImage;
        this.addProfileForm.patchValue(response?.data);
      }
    });
  }

  async submitProfileForm() {
    if (this.addProfileForm.valid) {
      if (this.isEditing) {
        let payLoad = this.addProfileForm.value
        payLoad['profileImage']=this.base64textString
        payLoad['id']= this.editId
        payLoad['mobileNo']=this.numberstr(this.addProfileForm?.value?.mobileNo)
        payLoad['roleName']=this.roleList.filter(c=>c.id==this.addProfileForm.value.roleId)[0]?.roleName
        this.userService.saveUser(payLoad).subscribe(
          (response) => {
          this.showLoader = false;
          if (response.status == 'Ok') {
            this.dataservice.updateAuth({ ...this.currentUser, ...response?.data });
            this.toastService.success(
              this.translateService.instant('PROFILE.ERROR')
            );
          } else {
            this.toastService.error(response.message);
            // response.error.map(obj => {
            //   if (obj.hasOwnProperty('emailId')) {
            //     this.formErrors['emailId'] = obj['emailId'];
            //   } else {
            //     this.formErrors['apierror'] = `* ${response.error}`;
            //   }
            // });
          }
        }, (error) => {
          this.showLoader = false;
        });
      }
    }
  }
  numberstr(phone){
    let number = phone.toString();
    return number;
  }
  submitForm(): void {
    this.submitAttempt = true;
    if (this.addForm.valid) {
      this.showLoader = true;
      const formData = {
        oldPassword: this.addForm.value.old_password,
        newPassword: this.addForm.value.new_password,
      };
      this.userService.updatePassword(formData).subscribe((response) => {
        this.showLoader = false;
        this.submitAttempt = false;
        if (response && response.status == "Ok") {
          this.toastService.success(response.message);
          this.formErrors.old_password = null;
          this.router.navigateByUrl('/profile');
        } else {
          this.toastService.error(response.message);
          // response.error.map(obj => {
          //   if (obj.hasOwnProperty('old_password')) {
          //     this.formErrors.old_password = obj.old_password;
          //   }
          //   if (obj.hasOwnProperty('confirm_password')) {
          //     this.formErrors.confirm_password = obj.confirm_password;
          //   }
          //   if (!obj.hasOwnProperty('old_password') && !obj.hasOwnProperty('confirm_password')) {
          //     this.formErrors.apierror = `* ${response.error}`;
          //   }
          // });
        }
      },
        (error) => {
          this.showLoader = false;
          this.submitAttempt = false;
          this.formErrors.apierror = `* Server Error`;
        }
      );
    }
  }

  getAllRoles() {
    this.roleService.getRoleList({}).subscribe((response: any) => {
      this.roleList = response.data
    })
  }

  ngOnDestroy(): void { }
}
