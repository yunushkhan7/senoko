import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import { IntegrationService } from 'src/app/service/integration.service';
import { TestPopupComponent } from '../test-popup/test-popup.component';

@Component({
  selector: 'app-mom-api',
  templateUrl: './mom-api.component.html',
  styleUrls: ['./mom-api.component.scss']
})
export class MomApiComponent implements OnInit {

  addForm: FormGroup;
  showLoader = false;
  isEditing = false;
  editId = null;
  id:any
  permissionObject: any = null;
  submitted:boolean;
  
  constructor(
    public dialog: MatDialog,
    private integrationService: IntegrationService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService
  ) { 

    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.APIIntegration;
    });

    this.addForm = this.fb.group({
      momapiEndpoint: ["", Validators.compose([Validators.required])]
    });
    this.getEditObject();

  }

  ngOnInit(): void {
  }


  getEditObject() {
    this.integrationService.getMomGateway().subscribe((response) => {
      if (response?.data) {
        this.id=response?.data?.id
        this.addForm.patchValue(response?.data);
      } else {
        this.router.navigateByUrl('/api-integration/Mom-Api');
      }
    });
  }


  getMomGateway(){
    this.showLoader = true;
    this.integrationService.getMomGateway().subscribe(
      (response) => {
        this.showLoader = false;
        if (response) {
        } else {
        }
      },
      (error) => {
        this.showLoader = false;
      }
    );
  }

  SaveMomGateway(){
    this.submitted = true
    if(this.addForm.valid){
      let payLoad=this.addForm.value
      payLoad['id']=this.id
      this.integrationService.SaveMomGateway(payLoad).subscribe(
        (response) => {
          this.showLoader = false;
          if (response) {
            this.router.navigateByUrl('/api-integration/Mom-Api');
          } else {
          }
        },
        (error) => {
          this.showLoader = false;
        }
      );
    }

  }

  testPopUp() {
    this.dialog.open(TestPopupComponent,{
      panelClass: 'asc-server-modal-box',
      data : {
        testPopUp : 'test'
      }
    });
  }

  goBack(){
    this.router.navigateByUrl('/dashboard');
  }
  
}
