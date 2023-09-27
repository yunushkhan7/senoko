import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnreturnedPassComponent } from './unreturned-pass/unreturned-pass.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { EntryReportComponent } from './entry-report/entry-report.component';
import { RollCallComponent } from './roll-call/roll-call.component';
import { AccessLogComponent } from './access-log/access-log.component';
import { AttendanceEmployeeComponent } from './attendance-employee/attendance-employee.component';
import { EntryEmployeeComponent } from './entry-employee/entry-employee.component';
import { EntryVisitorComponent } from './entry-visitor/entry-visitor.component';
import { VisitorListComponent } from './visitor-list/visitor-list.component';
import { Routes, RouterModule } from '@angular/router';
import { StationAdmissionPopupComponent } from './station-admission-popup/station-admission-popup.component';
import { MaterialExModule } from 'src/app/shared/material.module';
import { I18nModule } from 'src/app/shared/i18n/i18n.module';
import { FooterModule } from 'src/app/core/footer/footer.module';
import { AddUnreturnedPassComponent } from './add-unreturned-pass/add-unreturned-pass.component';
import { AddAttendanceComponent } from './add-attendance/add-attendance.component';
import { AddDailyEntryComponent } from './add-daily-entry/add-daily-entry.component';
import { AddRollCallComponent } from './add-roll-call/add-roll-call.component';
import { AddAccessLogComponent } from './add-access-log/add-access-log.component';
import { AddMonthlyEntrComponent } from './add-monthly-entr/add-monthly-entr.component';
import { PaginationModule } from 'src/app/core/pagination/pagination.module';
import { FormValidationModule } from 'src/app/shared/form-validation/form-validation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchModule } from 'src/app/core/search/search.module';
import { SharedModule } from 'src/app/shared/shared.module';
import {
  NgxMatDatetimePickerModule, 
  NgxMatNativeDateModule, 
  NgxMatTimepickerModule 
} from '@angular-material-components/datetime-picker';
import { DoorReleaseComponent } from './door-release/door-release.component';
import { CheckInStationComponent } from './check-in-station/check-in-station.component';
import { AddCheckInStationComponent } from './add-check-in-station/add-check-in-station.component';
import { AddDoorReleaseComponent } from './add-door-release/add-door-release.component';

const routes: Routes = [
  {
    path: "",
    component: UnreturnedPassComponent,
    data: { title: 'UnreturnedPasses' }
  },
  {
    path: 'Unreturned-Passes',
    component: UnreturnedPassComponent,
    data: { title: 'UnreturnedPasses' }
  },
  {
    path: 'Individual-Attendance',
    component: AttendanceComponent,
    data: { title: 'Attendance' }
  },
  {
    path: 'daily-entry',
    component: EntryReportComponent,
    data: { title: 'Daily Entry' }
  },
  {
    path: 'roll-call',
    component: RollCallComponent,
    data: { title: 'Roll call' }
  },
  {
    path: 'access-log',
    component: AccessLogComponent,
    data: { title: 'Access log' }
  },
  {
    path: 'attendance-employee',
    component: AttendanceEmployeeComponent,
    data: { title: 'Attendance Employee' }
  },
  {
    path: 'monthly-employee',
    component: EntryEmployeeComponent,
    data: { title: 'Monthly Employee' }
  },
  {
    path: 'entry-visitor',
    component: EntryVisitorComponent,
    data: { title: 'Entry Visitor' }
  },
  {
    path: 'visitor-list',
    component: VisitorListComponent,
    data: { title: 'Visitor list' }
  },
  {
    path: 'check-in-station',
    component: CheckInStationComponent,
    data: { title: 'Check In Station' }
  },
  {
    path: "add-check-in-station",
    component: AddCheckInStationComponent,
    data: { title: 'AddCheckInStation' }
  },
  {
    path: 'door-release',
    component: DoorReleaseComponent,
    data: { title: 'Door Release' }
  },
  {
    path: "add-door-release",
    component: AddDoorReleaseComponent,
    data: { title: 'AddDoorRelease' }
  },
  {
    path: "add-unreturnedpass",
    component: AddUnreturnedPassComponent,
    data: { title: 'AddUnreturnedpass' }
  },
  {
    path: 'add-attendance',
    component: AddAttendanceComponent,
    data: { title: 'Add Attendance' }
  },
  {
    path: 'add-daily-entry',
    component: AddDailyEntryComponent,
    data: { title: 'add-daily-entry' }
  },
  {
    path: 'add-roll-call',
    component: AddRollCallComponent,
    data: { title: 'add-roll-call' }
  },
  {
    path: 'add-access-log',
    component: AddAccessLogComponent,
    data: { title: 'add-access-log' }
  },
  {
    path: 'add-monthly-entry',
    component: AddMonthlyEntrComponent,
    data: { title: 'add-monthly-entry' }
  }
];
@NgModule({
  declarations: [
    UnreturnedPassComponent,
    AttendanceComponent,
    EntryReportComponent,
    RollCallComponent,
    AccessLogComponent,
    AttendanceEmployeeComponent,
    EntryEmployeeComponent,
    EntryVisitorComponent,
    VisitorListComponent,
    StationAdmissionPopupComponent,
    AddUnreturnedPassComponent,
    AddAttendanceComponent,
    AddDailyEntryComponent,
    AddRollCallComponent,
    AddAccessLogComponent,
    AddMonthlyEntrComponent,
    DoorReleaseComponent,
    CheckInStationComponent,
    AddCheckInStationComponent,
    AddDoorReleaseComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialExModule,
    I18nModule,
    FooterModule,
    PaginationModule,
    FormValidationModule,
    FormsModule,
    ReactiveFormsModule,
    SearchModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    SharedModule
  ],
  exports: [RouterModule, StationAdmissionPopupComponent],
})
export class ReportsModule {}
