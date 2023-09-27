import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AcsServerPopupComponent } from '../../acs-server-popup/acs-server-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { AcsServerService } from 'src/app/service/acs-server.service';
import { IntegrationService } from 'src/app/service/integration.service';
import { DataService } from 'src/app/service/data.service';
import { MYCustomValidators } from 'src/app/module/profile/custom-validators';


@Component({
  selector: 'app-acs-server-list',
  templateUrl: './acs-server-list.component.html',
  styleUrls: ['./acs-server-list.component.scss']
})
export class AcsServerListComponent implements OnInit {

  addForm: FormGroup;
  showLoader = false;
  isEditing = false;
  editId = null;
  id:any
  hide = true;
  permissionObject: any = null;
  submitted :boolean
  currentUser: any;
  
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private acsServerService: AcsServerService,
    private integrationService: IntegrationService,
    private dataService: DataService
    ) {
      if (this.activatedRoute.snapshot.paramMap.get('id')) {
        this.isEditing = true;
        this.editId = this.activatedRoute.snapshot.paramMap.get('id');
        if (this.isEditing) { this.getEditObject(); }
      }
      this.dataService.currentUser.subscribe((responce) => {
        if (responce){
          this.currentUser = responce;
          this.editId = this.currentUser?.userGuid;
        }
      });
      this.addForm = this.fb.group({
        hostName: ["", Validators.compose([Validators.required])],
        protocol: ["",  Validators.compose([Validators.required])],
        userName: ["",  Validators.compose([Validators.required])],
        password: ["",  Validators.compose([])],
        // uag:["",  Validators.compose([Validators.required])],
        remarks:[""],
        contractorsBufferStarttime: ["",  Validators.compose([Validators.required])],
        contractorsBufferEndtime: ["",  Validators.compose([Validators.required])],
        applicationId: ["",  Validators.compose([Validators.required])],
        directoryId: ["",  Validators.compose([Validators.required])],
        port: ["",  Validators.compose([Validators.required])]
      });

      this.dataService.permission.subscribe((response) => {
        this.permissionObject = response?.permissions?.ACSSettings;
      });
     }

  ngOnInit(): void {
    this.getAcsServerData();
  }

  getEditObject() {
    this.showLoader = true;
    this.acsServerService.getAcsServer().subscribe((response) => {
      if (response) {
        this.showLoader = false;
        this.id=response?.data?.id
        this.addForm.patchValue(response?.data);
      } else {
        this.router.navigateByUrl('/acs-settings/acs-server-list');
      }
    });
  }

  SaveAcsServer(){
    this.submitted = true
    if (this.addForm.valid) {
      this.showLoader = true;
      let payLoad=this.addForm.value
      payLoad['id']=this.id
      // payLoad['contractorsBufferStarttime']=this.numberstr(this.addForm?.value?.contractorsBufferStarttime)
      // payLoad['contractorsBufferEndtime']=this.numberstr(this.addForm?.value?.contractorsBufferEndtime)
      this.acsServerService.saveAcsServer(payLoad).subscribe(
        (response) => {
          this.showLoader = false;
          if (response) {
            this.router.navigateByUrl('/acs-settings/acs-server-list');
          } else {
          }
        },
        (error) => {
          this.showLoader = false;
        }
      );
    }


  }

  getAcsServerData(){
    this.acsServerService.getAcsServer().subscribe(
      (response) => {
        this.showLoader = false;
        if (response) {
         this.addForm.patchValue(response?.data);
         this.id=response?.data?.id
        } else {
        }
      },
      (error) => {
        this.showLoader = false;
      }
    );
  }

  acsserverlistpopup() {
    this.dialog.open(AcsServerPopupComponent,{
      panelClass: 'asc-server-modal-box'
    });
  }

  numberstr(phone){
    let number = phone.toString();
    return number;
  }

  testPopUp() {
    this.dialog.open(AcsServerPopupComponent,{
      panelClass: 'asc-server-modal-box',
      data : {
        testPopUp : 'test'
      }
    });
  }
  testPopUp2() {
    this.dialog.open(AcsServerPopupComponent,{
      panelClass: 'asc-server-modal-box',
      data : {
        testPopUp2 : 'test2'
      }
    });
  }

  testAcsServer(): void {
    this.showLoader = true;
    this.acsServerService.testAcsServer().subscribe((response) => {
      this.showLoader = false;
      if (response?.status == "Ok") {
        this.testPopUp()
      }
      if(response?.status == "Error"){
       this.testPopUp2()
      }
    }, (error) => {
      // this.toastr.error(error.message);
      this.showLoader = false;
    });
  }

  goBack(){
    this.router.navigateByUrl('/dashboard');
  }

}
