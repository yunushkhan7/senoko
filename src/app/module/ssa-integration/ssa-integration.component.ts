import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import { IntegrationService } from 'src/app/service/integration.service';
import { TestPopupComponent } from './test-popup/test-popup.component';


@Component({
  selector: 'app-ssa-integration',
  templateUrl: './ssa-integration.component.html',
  styleUrls: ['./ssa-integration.component.scss']
})
export class SsaIntegrationComponent implements OnInit {

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
      this.permissionObject = response?.permissions?.SSAIntegration;
    });
    
    this.addForm = this.fb.group({
      ssaConnectionString: ["", Validators.compose([Validators.required])]
    });
    this.getEditObject();

  }

  ngOnInit(): void {
  }


  getEditObject() {
    this.integrationService.getSSAConnection().subscribe((response) => {
      if (response?.data) {
        this.id=response?.data?.id
        this.addForm.patchValue(response?.data);
      } else {
        this.router.navigateByUrl('/api-integration/Mom-Api');
      }
    });
  }


  getSSAConnection(){
    this.showLoader = true;
    this.integrationService.getSSAConnection().subscribe(
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

  SaveSSAConnection(){
    this.submitted = true
    if(this.addForm.valid){
      let payLoad=this.addForm.value
      payLoad['id']=this.id
      this.integrationService.SaveSSAConnection(payLoad).subscribe(
        (response) => {
          this.showLoader = false;
          if (response) {
            this.router.navigateByUrl('/ssaintegration');
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
  testPopUp2() {
    this.dialog.open(TestPopupComponent,{
      panelClass: 'asc-server-modal-box',
      data : {
        testPopUp2 : 'test2'
      }
    });
  }

  testSSAConnection(): void {
    this.showLoader = true;
    this.integrationService.testSSAConnection().subscribe((response) => {
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
