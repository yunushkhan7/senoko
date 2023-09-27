import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import { IntegrationService } from 'src/app/service/integration.service';
import { TestPopupComponent } from '../test-popup/test-popup.component';

@Component({
  selector: 'app-sms-api',
  templateUrl: './sms-api.component.html',
  styleUrls: ['./sms-api.component.scss']
})
export class SmsApiComponent implements OnInit {
  [x: string]: any;
  addForm: FormGroup;
  showLoader = false;
  isEditing = false;
  editId = null;
  id:any
  permissionObject: any = null;
  submitted :boolean;
  constructor(
    public dialog: MatDialog,
    private integrationService: IntegrationService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService
  ) { 
    this.addForm = this.fb.group({
      smsapiEndpoint: ["", Validators.compose([Validators.required])],
      userId: ["", Validators.compose([Validators.required])],
      bearerToken: ["", Validators.compose([Validators.required])]
    });
    this.getEditObject();

    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.APIIntegration;
    });
  }

  ngOnInit(): void {
  }


  getEditObject() {
    this.integrationService.getSmsGateway().subscribe((response) => {
      if (response?.data) {
        this.id=response?.data?.id
        this.addForm.patchValue(response?.data);
      } else {
        this.router.navigateByUrl('/api-integration/Sms-Api');
      }
    });
  }


  getSmsGateway(){
    this.showLoader = true;
    this.integrationService.getSmsGateway().subscribe(
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

  SaveSmsGateway(){
    this.submitted = true
    if(this.addForm.valid){
      let payLoad=this.addForm.value
      payLoad['id']=this.id
      this.integrationService.SaveSmsGateway(payLoad).subscribe(
        (response) => {
          this.showLoader = false;
          if (response) {
            this.router.navigateByUrl('/api-integration/Sms-Api');
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
        smsPopUp : 'sms'
      }
    });
  }

  goBack(){
    this.router.navigateByUrl('/dashboard');
  }

}
