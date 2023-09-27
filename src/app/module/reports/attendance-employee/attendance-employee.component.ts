import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StationAdmissionPopupComponent } from '../station-admission-popup/station-admission-popup.component';

@Component({
  selector: 'app-attendance-employee',
  templateUrl: './attendance-employee.component.html',
  styleUrls: ['./attendance-employee.component.scss']
})
export class AttendanceEmployeeComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  OpenStationAdmissionDialog() {
    this.dialog.open(StationAdmissionPopupComponent,{
      panelClass: 'admission-box'
    });
  }
}
