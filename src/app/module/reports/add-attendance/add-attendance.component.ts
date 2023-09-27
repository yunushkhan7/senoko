import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/service/common.service';
import { ReportService } from 'src/app/service/report.service';
import { maxValue } from 'src/app/shared/common';



@Component({
  selector: 'app-add-attendance',
  templateUrl: './add-attendance.component.html',
  styleUrls: ['./add-attendance.component.scss']
})
export class AddAttendanceComponent implements OnInit {

  addForm: FormGroup;
  showLoader = false;
  isEditing = false;
  editId = null;
  submitted: boolean;
  minDate: Date;
  maxDate: Date;
  minDate2: Date;
  maxDate2: Date;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private reportService: ReportService,
    private toastService: ToastrService,
    private commonService: CommonService
  ) { 

    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
      if (this.isEditing) {
        this.getEditObject();
      }
    }


    this.addForm = this.fb.group({
      firstName: ["", Validators.compose([Validators.required, this.commonService.nameValidator])],
      lastName:[""],
      idNumber: [""],
      dob: ["2022-08-25T04:06:30.179Z"],
      gender: [""],
      companyName:[""],
      reason_for_visit:[""],
      visitType:[""],
      startTime: ["2022-08-25"],
      endTime: ["2022-08-25"],
      host: ["",Validators.compose([Validators.required])],
      workType: [""],
      siC_Expiry_Date: ["2022-08-24T07:59:02.517Z"],
      emA_Expiry_Date: ["2022-08-24T07:59:02.517Z"],
      registerType: ["",Validators.compose([Validators.required])],
      registerEntryType: [""],
      cardNo: ["",Validators.compose([Validators.required, this.commonService.nameValidator])],
      phoneNumber: [""],
      nric_passportnumber: [""],
      overduetime: ["2022-08-26T12:21:51.908Z"],
      age: ["0"],
      lasteventlocation: [""],
      lasteventon: ["2022-08-26T12:21:51.908Z"],
      registerStatus: [""],
      athorizedtimestart: ["2022-08-24T07:59:02.517Z"],
      athorizedtimeEnd: ["2022-08-24T07:59:02.517Z"],
      approvedstarttime: ["",Validators.compose([Validators.required, this.dateRangeValidator])],
      approvedendtime: ["",Validators.compose([Validators.required, this.dateRangeValidator])],
      entrancelocation: ["",Validators.compose([Validators.required])],
      entrancetime: ["",Validators.compose([Validators.required])],
      exittime: ["",Validators.compose([Validators.required])],
      exitlocation: ["",Validators.compose([Validators.required])],
      organizationdivision: ["",Validators.compose([Validators.required, this.commonService.nameValidator])],
      bcPteam: ["",Validators.compose([Validators.required])],
      rollcallgroup: [""],
      eventtype: [""],
      eventlocation: [""],
      eventtime: ["2022-08-26T12:21:51.908Z"],
      visitworktype: [""],
      stationname: [""],
      ssAmember: [false],
      moMverified: [false],
      overridenby: [""],
      reasonforoverride: [""],
      section:["",Validators.compose([Validators.required])]
    });
    

  }

  ngOnInit(): void {
  }

  private dateRangeValidator: ValidatorFn = (): {
    [key: string]: any;
  } | null => {
    let invalid = false;
    const approvedstarttime = this.addForm && this.addForm.get("approvedstarttime").value;
    const approvedendtime = this.addForm && this.addForm.get("approvedendtime").value;
    if (approvedstarttime && approvedendtime) {
      invalid = new Date(approvedstarttime).valueOf() > new Date(approvedendtime).valueOf();
    }
    return invalid ? { invalidRange: { approvedstarttime, approvedendtime } } : null;
  };
  
  getEditObject() {
    this.reportService.getReportById(this.editId).subscribe((response) => {
      if (response?.data) {
        this.addForm.patchValue(response?.data?.data);
      } else {
        this.router.navigateByUrl('/report/attendance');
      }
    });
  }


  submitForm() {
    this.submitted = true
    if (this.addForm.valid) {
      this.showLoader = true;
      let payLoad=this.addForm.value
      payLoad['age']=this.numberstr(this.addForm?.value?.age)
      this.reportService.saveReport(payLoad).subscribe(
        (response) => {
          this.showLoader = false;
          if (response) {
            this.router.navigateByUrl('/report/attendance');
          } else {
          }
        },
        (error) => {
          this.showLoader = false;
        }
      );
    }
  }
  numberstr(phone){
    let number = phone.toString();
    return number;
  }

  eDateChangedStart(res: any) {
    this.minDate = res.value;
    // let date = this.datepipe.transform(res.value,'mm/dd/yyyy hh:mm:ss')
  }
  eDateChangedStart2(res: any) {
    this.minDate2 = res.value;
    // let date = this.datepipe.transform(res.value,'mm/dd/yyyy hh:mm:ss')
  }
}
