import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { UserService } from 'src/app/service/user.service';
import { DataService } from 'src/app/service/data.service';
import { emailRegEx, keyPressAddress, keyPressAlpha } from 'src/app/shared/common';
import { ToastrService } from 'ngx-toastr';
import { RoleService } from 'src/app/service/role.service';
import { CommonService } from 'src/app/service/common.service';
import { TranslateService } from '@ngx-translate/core';

@AutoUnsubscribe()
@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {

  hide = true;
  loadingState = false;
  addForm: FormGroup;
  showLoader = false;
  formErrors = {
    emailId: null,
    apierror: null,
  };
  isEditing = false;
  editId = null;
  selectedBUCode: any;
  currentUser: any;
  currentTenant: any;
  selectedProfileFile: any;
  roleList: any = [];
  searchFilter: any = { filters: [] };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService,
    private dataService: DataService,
    private toastService: ToastrService,
    private roleService: RoleService,
    private commonService: CommonService,
    private translateService:TranslateService
  ) {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
      if (this.isEditing) { this.getEditObject(); }
    }

    this.addForm = this.fb.group({
      firstName: ["", Validators.compose([Validators.required])],
      lastName: [""],
      emailId: [null, [Validators.required, Validators.pattern(emailRegEx)]],
      roleId: [null, Validators.compose([Validators.required])],
      profilePicture:[null, Validators.compose([Validators.required])]
    });
    this.dataService.currentUser.subscribe((user) => { if (user) this.currentUser = user; });
  }

  ngOnInit() {
    this.getAllRoles()
  }

  getAllRoles() {
    this.roleService.getRoleList({searchFilter: {filters: []}}).subscribe((response: any) => {
      this.roleList = response.data
    })
  }

  getEditObject() {
    this.userService.getUserById({ id: this.editId }).subscribe((response) => {
      if (response) {
        this.addForm.patchValue(response.data)
      } else {
        this.router.navigateByUrl('/user');
      }
    });
  }

  profileChangeEvent(fileInputFile: any) {
    const reg = /(.*?)\.(jpg|jpeg|png|gif|giff)$/;
    if (!fileInputFile.target.files[0].name.match(reg)) {
      this.toastService.error('Please select valid file');
      this.selectedProfileFile = null;
      return false;
    } else {
      this.selectedProfileFile = null;
      this.selectedProfileFile = fileInputFile.target.files[0];
      this.addForm.get('profilePicture').setValue(this.selectedProfileFile.name);
    }
  }

  async submitForm() {
    if (this.addForm.valid) {
      this.showLoader = true;
      if (this.selectedProfileFile) {
        const data = new FormData(); data.append('file', this.selectedProfileFile);
        await this.commonService.fileUpload(data).then((res: any) => { this.addForm.get('profilePicture').setValue(res.data); })
      }
      if (this.isEditing) {
        this.userService.saveUser({ ...this.addForm.value, id: this.editId }).subscribe((response) => {
          this.showLoader = false;
          if (response) {
            this.router.navigateByUrl('/user');
          } else { }
        }, (error) => {
          this.showLoader = false;
        });
      } else {

        this.userService.saveUser({ ...this.addForm.value }).subscribe((response) => {
          this.showLoader = false;
          if (response) {
            this.router.navigateByUrl('/user');
          } else { }
        }, (error) => {
          this.showLoader = false;
        });
      }
    }
  }

  verifyEmail() {
    this.formErrors['emailId'] = false;
    if (this.addForm.controls['emailId'].valid)
      this.userService.checkLoginIdExists({ emailId: this.addForm.value.emailId }).subscribe((res) => {
        if (res.message == 'Exist') {
          this.addForm.controls['emailId'].setErrors({ isExit: true });
          this.formErrors['emailId'] = this.translateService.instant('USER.ERROR.MESSAGE');
        } else {
          // this.addForm.controls['emailId'].setErrors(null);
          this.addForm.get('emailId').setValidators(Validators.compose([Validators.required, Validators.pattern(emailRegEx)]));
          this.addForm.get('emailId').updateValueAndValidity();
          this.formErrors['emailId'] = false;
        }
      })
  }

  validateText(event: any) { keyPressAlpha(event) }
  validateAddress(event: any) { keyPressAddress(event) }
  ngOnDestroy(): void { }
}
