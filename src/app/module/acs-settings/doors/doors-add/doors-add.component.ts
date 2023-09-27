import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DoorService } from 'src/app/service/door.service';

@Component({
  selector: 'app-doors-add',
  templateUrl: './doors-add.component.html',
  styleUrls: ['./doors-add.component.scss']
})
export class DoorsAddComponent implements OnInit {

  addForm: FormGroup;
  showLoader = false;
  isEditing = false;
  editId = null;
  submitted: boolean;
  StatusList:any=[
    {
      Status: 'YES',
      StatusCode: true,
    },
    {
      Status: 'NO',
      StatusCode: false,
    },
  ];
  rederId:any;
  pannelId:any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private doorService: DoorService,
  ) {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
      if (this.isEditing) { this.getEditObject(); }
    }


  this.addForm = this.fb.group({
    doorName: ["", Validators.compose([Validators.required])],
    acsDoorName: [""],
    doorDirection:["", Validators.compose([Validators.required])],
    allowsreleasefromVMSStation:["", Validators.compose([Validators.required])],
    remarks: ["", Validators.compose([])],
  });

  }

  ngOnInit(): void {
  }


  getEditObject() {

    this.showLoader = true;
    this.doorService.GetDoorById(this.editId).subscribe((response) => {
      if (response) {
        this.rederId = response?.data?.readerID
        this.pannelId = response?.data?.panelID
        this.showLoader = false;
        this.addForm.patchValue(response?.data);
      } else {
        this.router.navigateByUrl('/acs-settings/doors-list');
      }
    });
  }

  userDoor:any = [];
  submitForm() {
    this.submitted = true
      this.showLoader = true;
      if (this.addForm.valid) {
        if (this.isEditing) {
          let payload=this.addForm.value
          payload['id']=this.editId
          payload['readerID']=this.rederId
          payload['panelID']=this.pannelId
          payload['allowsreleasefromVMSStation']=this.numberstr(this.addForm?.value?.allowsreleasefromVMSStation)
          this.userDoor.push(payload)
          this.doorService.saveDoor(this.userDoor).subscribe(
            (response) => {
              this.showLoader = false;
              if (response) {
                this.router.navigateByUrl('/acs-settings/doors-list');
              } else {
              }
            },
            (error) => {
              this.showLoader = false;
            }
          );
        } else {
          // if (this.addForm.valid) {
          //   let payload=this.addForm.value
          //   payload['allowsreleasefromVMSStation']=this.numberstr(this.addForm?.value?.allowsreleasefromVMSStation)
          //   this.userAccess.push(payload)
          //   this.doorService.saveDoor(payload).subscribe(
          //     (response) => {
          //       this.showLoader = false;
          //       if (response) {
          //         this.router.navigateByUrl('/acs-settings/doors-list');
          //       } else {
          //       }
          //     },
          //     (error) => {
          //       this.showLoader = false;
          //     }
          //   );
          // }
        }
      }


  }

  numberstr(phone){ 
    let boolValue = JSON.parse(phone);
    return boolValue;
  }

}
