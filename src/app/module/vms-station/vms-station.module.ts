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
import { VmsStationListComponent } from './vms-station-list/vms-station-list.component';
import { VmsStationAddComponent } from './vms-station-add/vms-station-add.component';
import { FooterModule } from 'src/app/core/footer/footer.module';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

const routes: Routes = [
  {
    path: "",
    component: VmsStationListComponent,
    data: { title: 'VMS Station list' }
  },
  {
    path: "add",
    component: VmsStationAddComponent,
    data: { title: 'Add VMS Station' }
  },
  {
    path: 'edit/:id',
    component: VmsStationAddComponent,
    data: { title: 'Update VMS Station' }
  }
]

@NgModule({
  declarations: [VmsStationListComponent, VmsStationAddComponent],
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
    FooterModule,
    I18nModule,
    NgxIntlTelInputModule
  ]
})
export class VmsStationModule { }
