import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import { TermsconditionService } from 'src/app/service/termscondition.service';

@Component({
  selector: 'app-terms-condition',
  templateUrl: './terms-condition.component.html',
  styleUrls: ['./terms-condition.component.scss']
})
export class TermsConditionComponent implements OnInit {

  addForm: FormGroup;
  showLoader = false;
  isEditing = false;
  editId = null;
  termsList: Array<any> = [];
  id:any
  permissionObject: any = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private termsconditionService: TermsconditionService,
    private dataService: DataService
  ) { 


    this.addForm = this.fb.group({
      headerText: [""],
      bodyText: [""],
      checkboxText:[""],
      isDeleted:[true],
    });

    this.getEditObject();

    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response?.permissions?.Termsandconditions;
    });

   }

  ngOnInit(): void {
  }


  getEditObject() {
    this.termsconditionService.getTermsCondition().subscribe((response) => {
      if (response?.data) {
        this.id=response?.data?.id
        this.addForm.patchValue(response?.data);
      } else {
        this.router.navigateByUrl('/terms-condition');
      }
    });
  }
  

  saveTermsCondition(){
    if(this.addForm.valid){
      let payLoad=this.addForm.value
      payLoad['id']=this.id
      this.termsconditionService.saveTermsCondition(payLoad).subscribe(
        (response) => {
          this.showLoader = false;
          if (response) {
            this.router.navigateByUrl('/terms-condition');
            
          } else {
          }
        },
        (error) => {
          this.showLoader = false;
        }
      );
    }

  }

  getTermsCondition(){
    this.termsconditionService.getTermsCondition().subscribe((response) => {
      this.showLoader = false;
      if (response.data) {
        this.termsList = response.data;
      
      }
    }, (error) => {
      this.showLoader = false;
    });
  }

  goBack(){
    this.router.navigateByUrl('/dashboard');
  }
}
