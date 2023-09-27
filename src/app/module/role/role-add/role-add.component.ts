import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { RoleService } from 'src/app/service/role.service';
import { DataService } from 'src/app/service/data.service';
import { keyPressAddress, keyPressAlpha } from 'src/app/shared/common';
import { AuthService } from 'src/app/service/auth.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-role-add',
  templateUrl: './role-add.component.html',
  styleUrls: ['./role-add.component.scss']
})
export class RoleAddComponent implements OnInit {

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
  moduleList: any = [];
  moduleIds: any = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private roleService: RoleService,
    private dataService: DataService,
    private authService: AuthService
  ) {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
      if (this.isEditing) { this.getEditObject(); }
    }

    this.addForm = this.fb.group({
      roleName: ["", Validators.compose([Validators.required])],
      description: ["", Validators.compose([Validators.required, Validators.maxLength(150)])],
    });

    this.dataService.currentUser.subscribe((user) => { if (user) this.currentUser = user; });
  }

  ngOnInit() {
    this.getModules();
  }

  getModules() {
    this.showLoader = true;
    // this.authService.GetModulesForRoles({}).subscribe((res: any) => {
    //   this.showLoader = false;
    //   this.moduleList = res.data;
    //   this.moduleList.forEach(e => {
    //     e.isChecked = false;
    //     e.operation.forEach(e2 => {
    //       e2.isChecked = false;
    //     });
    //   });
    //   // disable functionality code
    //   this.moduleList.forEach(e => {
    //     e.operation.forEach(e2 => {
    //       e2.isdisable = false;
    //     });
    //     e.operation.forEach((ele, index) => {
    //       if (ele.operationName == "List" && ele.isChecked == false) {
    //         for (let i = index + 1; i < e.operation.length; i++) {
    //           e.operation[i].isdisable = true;
    //         }
    //       }
    //     });
    //   });
    // },(err:any)=>{
    //   this.showLoader = false;
    // })
  }

  getEditObject() {
    this.showLoader = true;
    this.roleService.getRoleById({ id: this.editId }).subscribe((response) => {
      if (response) {
        this.showLoader = false;
        this.addForm.patchValue(response.data);
        const allEqual = arr => arr.every(v => v.isChecked === arr[0].isChecked)
        setTimeout(() => {
          this.moduleList.forEach(a => {
            a.operation.forEach(x => {
              response.data.moduleIds.forEach(y => {
                if (x.id == y) {
                  x.isChecked = true;
                  this.moduleIds.push(y)
                }
                if (x.isChecked) {
                  let n = allEqual(a.operation);
                  a.isChecked = n;
                }
              });
            });
            // disable functionality code
            a.operation.forEach((ele, index) => {
              if (ele.operationName == "List" && ele.isChecked == true) {
                for (let i = index + 1; i < a.operation.length; i++) {
                  a.operation[i].isdisable = false;
                }
              }
            });

          });
        }, 500);
      } else {
        this.router.navigateByUrl('/role');
      }
    });
  }

  onChildCheckbox(event, permission, item) {
    const allEqual = arr => arr.every(v => v.isChecked === arr[0].isChecked)
    const index = this.moduleIds.indexOf(permission.id)
    permission.isChecked = event.checked
    if (event.checked)
      this.moduleIds.push(permission.id);
    else
      this.moduleIds.splice(index, 1)
    item.operation.forEach(element => {
      if (element.isChecked)
        item.isChecked = allEqual(item.operation);
    });
    this.moduleIds = [...new Set(this.moduleIds)];

    //disable functionality code
    if (permission.operationName == "List") {
      if (permission.isChecked) {
        item.operation.forEach(e => {
          e.isdisable = false;
        });
      } else {
        item.operation.forEach((ele, index) => {
          if (ele.operationName == "List" && ele.isChecked == false) {
            for (let i = index + 1; i < item.operation.length; i++) {
              item.operation[i].isdisable = true;
              item.operation[i].isChecked = false;
            }
          }
        });
      }
    }
  }

  onParentCheckbox(event, item) {
    item.isChecked = event.checked
    if (item.isChecked) {
      this.moduleIds.forEach(a => {
        item.operation.forEach(b => {
          if (a == b.id) {
            const index = this.moduleIds.indexOf(a)
            this.moduleIds.splice(index, 1)
          }
        });
      });
      item.operation.forEach(e => {
        e.isChecked = true;
        this.moduleIds.push(e.id);
      });
    } else {
      item.operation.forEach((e) => {
        const index = this.moduleIds.indexOf(e.id)
        e.isChecked = false;
        this.moduleIds.splice(index, 1)
      });
    }
    this.moduleIds = [...new Set(this.moduleIds)];

    // disable functionality code
    if (!item.isChecked) {
      item.operation.forEach((ele, index) => {
        if (ele.operationName == "List" && ele.isChecked == false) {
          for (let i = index + 1; i < item.operation.length; i++) {
            item.operation[i].isdisable = true;
          }
        }
      });
    } else {
      item.operation.forEach((ele, index) => {
        for (let i = index + 1; i < item.operation.length; i++) {
          item.operation[i].isdisable = false;
        }
      });
    }
  }

  submitForm() {
    if (this.addForm.valid) {
      const payload = {
        id: this.editId,
        roleName: this.addForm.get('roleName').value,
        description: this.addForm.get('description').value,
        moduleIds: this.moduleIds
      }
      this.showLoader = true;
      if (this.isEditing) {
        this.roleService.saveRole(payload).subscribe((response) => {
          this.showLoader = false;
          if (response) {
            this.router.navigateByUrl('/role');
          } else { }
        }, (error) => {
          this.showLoader = false;
        });
      } else {
        this.roleService.saveRole(payload).subscribe((response) => {
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
