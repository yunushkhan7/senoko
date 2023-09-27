import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { RoleService } from 'src/app/service/role.service';
import { DataService } from 'src/app/service/data.service';
import { keyPressAddress, keyPressAlpha } from 'src/app/shared/common';

@AutoUnsubscribe()
@Component({
  selector: 'app-role-add',
  templateUrl: './role-permission-add.component.html',
  styleUrls: ['./role-permission-add.component.scss']
})
export class RolePermissionAddComponent implements OnInit {

  loadingState = false;
  addForm: FormGroup;
  showLoader = false;
  formErrors = {
    email: null,
    apierror: null,
  };
  isEditing = false;
  editId = null;

  currentUser: any;
  currentTenant: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private roleService: RoleService,
    private dataService: DataService,
  ) {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
      if (this.isEditing) { this.getEditObject(); }
    }

    this.addForm = this.fb.group({
      addressName: [null, Validators.compose([Validators.required])],
      building: [""],
      street: [""],
      locality: [""],
      postalcode: ["", Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(10)])],
      city: [""],
      state: [""],
      country: ["", Validators.compose([Validators.required])],
      isPrimary: [false]
    });

    this.dataService.currentUser.subscribe((user) => { if (user) this.currentUser = user; });
  }

  ngOnInit() { }

  getEditObject() {
    this.roleService.getRoleById({ id: this.editId }).subscribe((response) => {
      if (response) {
        this.addForm.patchValue(response.data)
      } else {
        this.router.navigateByUrl('/role');
      }
    });
  }

  submitForm() {
    if (this.addForm.valid) {
      this.showLoader = true;
      if (this.isEditing) {
        this.roleService.saveRole({ ...this.addForm.value, id: this.editId }).subscribe((response) => {
          this.showLoader = false;
          if (response) {
            this.router.navigateByUrl('/role');
          } else { }
        }, (error) => {
          this.showLoader = false;
        });
      } else {

        this.roleService.saveRole({ ...this.addForm.value }).subscribe((response) => {
          this.showLoader = false;
          if (response) {
            this.router.navigateByUrl('/role');
          } else { }
        }, (error) => {
          this.showLoader = false;
        });
      }
    }
  }

  validateText(event: any) { keyPressAlpha(event) }
  validateAddress(event: any) { keyPressAddress(event) }
  ngOnDestroy(): void { }
}
