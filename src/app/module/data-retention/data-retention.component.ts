import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import { DataretentionService } from 'src/app/service/dataretention.service';
import { maxValue } from 'src/app/shared/common';

@Component({
  selector: 'app-data-retention',
  templateUrl: './data-retention.component.html',
  styleUrls: ['./data-retention.component.scss']
})
export class DataRetentionComponent implements OnInit {

  addForm: FormGroup;
  showLoader = false;
  isEditing = false;
  editId = null;
  id:any
  permissionObject: any = null;
  submitted : boolean;

  constructor(    
    private dataretentionService: DataretentionService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService
  ) {

    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
      if (this.isEditing) { this.getEditObject(); }
    }

    this.addForm = this.fb.group({
      reportsDataKeepDays: ['', [Validators.required, maxValue(999)]],
      userAuditKeepDays: ['', [Validators.required, maxValue(999)]],
      systemLogsKeepDays: ['', [Validators.required, maxValue(999)]],
      passwordExpirationDays:['', [Validators.required, maxValue(999)]],
    });

    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.DataRetention;
    });

  }

  ngOnInit(): void {
    this.getDataRetentionData();
  }

  getEditObject() {
    this.showLoader = true;
    this.dataretentionService.getDataRetentionList().subscribe((response) => {
      if (response) {
        this.showLoader = false;
        this.addForm.patchValue(response?.data);
      } else {
        this.router.navigateByUrl('/data-retention');
      }
    });
  }

  SaveDataRetention(){
    this.submitted = true
    if(this.addForm.valid){
      let payload=this.addForm.value
      payload['id']=this.id
      this.dataretentionService.saveDataRetention(this.addForm.value).subscribe(
        (response) => {
          this.showLoader = false;
          if (response) {
            this.router.navigateByUrl('/data-retention');
          } else {
          }
        },
        (error) => {
          this.showLoader = false;
        }
      );
    }

  }
  addFormReset(){
    this.addForm.reset();
  }
  getDataRetentionData(){
    this.dataretentionService.getDataRetentionList().subscribe(
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

  goBack(){
    this.router.navigateByUrl('/dashboard');
  }

}
