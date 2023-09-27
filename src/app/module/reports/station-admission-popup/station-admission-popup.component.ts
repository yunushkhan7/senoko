import { Component, OnInit } from '@angular/core';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-station-admission-popup',
  templateUrl: './station-admission-popup.component.html',
  styleUrls: ['./station-admission-popup.component.scss']
})
export class StationAdmissionPopupComponent implements OnInit {
  

  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Select Company Name'},
    {value: 'pizza-1', viewValue: 'Select Company Name'},
    {value: 'tacos-2', viewValue: 'Select Company Name'},
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
