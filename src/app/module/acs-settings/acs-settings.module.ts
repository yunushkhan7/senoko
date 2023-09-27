import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nModule } from 'src/app/shared/i18n/i18n.module';
import { LoaderModule } from 'src/app/core/loader/loader.module';
import { SearchModule } from 'src/app/core/search/search.module';
import { PaginationModule } from 'src/app/core/pagination/pagination.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialExModule } from 'src/app/shared/material.module';
import { FormValidationModule } from 'src/app/shared/form-validation/form-validation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AcsServerPopupComponent } from './acs-server-popup/acs-server-popup.component';
import { AcsServerAddComponent } from './acs-server/acs-server-add/acs-server-add.component';
import { AcsServerListComponent } from './acs-server/acs-server-list/acs-server-list.component';
import { DoorsAddComponent } from './doors/doors-add/doors-add.component';
import { DoorsListComponent } from './doors/doors-list/doors-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { ImportDoorsPopupComponent } from './doors/import-doors-popup/import-doors-popup.component';
import { FooterModule } from 'src/app/core/footer/footer.module';
import { UserAccessGroupListComponent } from './user-access-groups/user-access-group-list/user-access-group-list.component';
import { UserAccessGroupAddComponent } from './user-access-groups/user-access-group-add/user-access-group-add.component';
import { DoorListPopupComponent } from './user-access-groups/door-list-popup/door-list-popup.component';
import { BadgeGroupsAddComponent } from './badge-groups/badge-groups-add/badge-groups-add.component';
import { BadgeGroupsListComponent } from './badge-groups/badge-groups-list/badge-groups-list.component';
import { BadgeGroupsPopupComponent } from './badge-groups/badge-groups-popup/badge-groups-popup.component';
import { CardHoldersListComponent } from './card-holders/card-holders-list/card-holders-list.component';
import { CardHoldersPopupComponent } from './card-holders/card-holders-popup/card-holders-popup.component';
import { BcpGroupListComponent } from './bcp-groups/bcp-group-list/bcp-group-list.component';
import { BcpGroupPopupComponent } from './bcp-groups/bcp-group-popup/bcp-group-popup.component';
import { RollCallGroupListComponent } from './roll-call-groups/roll-call-group-list/roll-call-group-list.component';
import { RollCallGroupPopupComponent } from './roll-call-groups/roll-call-group-popup/roll-call-group-popup.component';
import { EmployeeListComponent } from './employee-division/employee-list/employee-list.component';
import { EmployeePopupComponent } from './employee-division/employee-popup/employee-popup.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { EmployeeSectionListComponent } from './employee-section/employee-section-list/employee-section-list.component';
import { EmployeeSectionPopupComponent } from './employee-section/employee-section-popup/employee-section-popup.component';
const routes: Routes = [
  {
    path: "",
    component: AcsServerListComponent,
    data: { title: 'Acs server Settings' }
  },
  {
    path: 'acs-server-list',
    component: AcsServerListComponent,
    data: { title: 'Acs server List' }
  },
  {
    path: 'add',
    component: AcsServerAddComponent,
    data: { title: 'Acs server Add' }
  },
  {
    path: 'edit/:id',
    component: AcsServerAddComponent,
    data: { title: 'Update Acs server' }
  },
  {
    path: 'doors-list',
    component: DoorsListComponent,
    data: { title: 'Doors List' }
  },
  {
    path: 'door-add',
    component: DoorsAddComponent,
    data: { title: 'Doors Add' }
  },
  {
    path: 'door-edit/:id',
    component: DoorsAddComponent,
    data: { title: 'Update Doors' }
  },
  {
    path: 'access-levels',
    component: UserAccessGroupListComponent,
    data: { title: 'User access-levels List' }
  },
  {
    path: 'user-access',
    component: UserAccessGroupAddComponent,
    data: { title: 'User access-levels' }
  },
  {
    path: 'access-levels/:id',
    component: UserAccessGroupAddComponent,
    data: { title: 'Update User access-levels' }
  },
  {
    path: 'card-holder',
    component: CardHoldersListComponent,
    data: { title: 'Card Holders' }
  },
  {
    path: 'badge-group',
    component: BadgeGroupsListComponent,
    data: { title: 'Badge Group' }
  },
  {
    path: 'badge-group-edit/:id',
    component: BadgeGroupsAddComponent,
    data: { title: 'Update Badge Groups' }
  },
  {
    path: 'badge-group-add',
    component: BadgeGroupsAddComponent,
    data: { title: 'Badge Groups Add' }
  },
  {
    path: 'bcp-group',
    component: BcpGroupListComponent,
    data: { title: 'BCP Groups' }
  },
  {
    path: 'roll-call-group',
    component: RollCallGroupListComponent,
    data: { title: 'Roll Call Groups' }
  },
  {
    path: 'employee-divisions',
    component: EmployeeListComponent,
    data: { title: 'Employee Divisions' }
  },
  {
    path: 'employee-sections',
    component: EmployeeSectionListComponent,
    data: { title: 'Employee Sections' }
  },
]

@NgModule({
  declarations: [
    AcsServerPopupComponent,
    AcsServerAddComponent,
    AcsServerListComponent,
    DoorsAddComponent,
    DoorsListComponent,
    ImportDoorsPopupComponent,
    UserAccessGroupListComponent,
    UserAccessGroupAddComponent,
    DoorListPopupComponent,
    BadgeGroupsAddComponent,
    BadgeGroupsListComponent,
    BadgeGroupsPopupComponent,
    CardHoldersListComponent,
    CardHoldersPopupComponent,
    BcpGroupListComponent,
    BcpGroupPopupComponent,
    RollCallGroupListComponent,
    RollCallGroupPopupComponent,
    EmployeeListComponent,
    EmployeePopupComponent,
    EmployeeSectionListComponent,
    EmployeeSectionPopupComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    FormValidationModule,
    MaterialExModule,
    SharedModule,
    PaginationModule,
    SearchModule,
    LoaderModule,
    I18nModule,
    TranslateModule,
    FooterModule,
    NgxSpinnerModule
  ]
})
export class AcsSettingsModule { }
