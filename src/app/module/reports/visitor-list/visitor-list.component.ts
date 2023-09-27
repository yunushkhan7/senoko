import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StationAdmissionPopupComponent } from '../station-admission-popup/station-admission-popup.component';


@Component({
  selector: 'app-visitor-list',
  templateUrl: './visitor-list.component.html',
  styleUrls: ['./visitor-list.component.scss']
})
export class VisitorListComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  OpenStationAdmissionDialog() {
    this.dialog.open(StationAdmissionPopupComponent,{ 
      panelClass: 'admission-box'
    });
  }
}
