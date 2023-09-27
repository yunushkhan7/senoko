import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAccessGroupService } from 'src/app/service/user-access-group.service';

@Component({
  selector: 'app-user-access-group-add',
  templateUrl: './user-access-group-add.component.html',
  styleUrls: ['./user-access-group-add.component.scss']
})
export class UserAccessGroupAddComponent implements OnInit {

  addForm: FormGroup;
  showLoader = false;
  isEditing = false;
  editId = null;
  submitted: boolean;
  accesId:any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userAccessGroupService: UserAccessGroupService
  ) {

    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
      if (this.isEditing) { this.getEditObject(); }
    }
    this.addForm = this.fb.group({
      userAccessGroupName: ["", Validators.compose([Validators.required])],
      remarks: ["", Validators.compose([Validators.required])]
    });

   }

  ngOnInit(): void {
  }

  getEditObject() {
    this.showLoader = true;
    this.userAccessGroupService.getUserAccessGroupById(this.editId).subscribe((response) => {
      if (response) {
        this.showLoader = false;
        this.accesId = response?.data?.accessLevelId
        this.addForm.patchValue(response?.data);
      } else {
        this.router.navigateByUrl('/acs-settings/access-levels');
      }
    });
  }
  userAccess:any = [];
  saveUserAccessGroup(){
    this.submitted = true
    if(this.addForm.valid){
      let payLoad=this.addForm.value
      payLoad['id']=this.editId
      payLoad['accessLevelId']=this.accesId
      // this.userAccess.userAccessGroupName = this.addForm.value.userAccessGroupName
      this.userAccess.push(payLoad)
      this.userAccessGroupService.saveUserAccessGroup(this.userAccess).subscribe(
        (response) => {
          this.showLoader = false;
          if (response) {
            this.router.navigateByUrl('/acs-settings/access-levels');
          } else {
          }
        },
        (error) => {
          this.showLoader = false;
        }
      );
    }

  }
  close(){
    this.router.navigateByUrl('/acs-settings/access-levels');
  }

}
