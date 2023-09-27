import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormValidationModule } from 'src/app/shared/form-validation/form-validation.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaginationModule } from 'src/app/core/pagination/pagination.module';
import { MaterialExModule } from 'src/app/shared/material.module';
import { SearchModule } from 'src/app/core/search/search.module';
import { LoaderModule } from 'src/app/core/loader/loader.module';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleAddComponent } from './role-add/role-add.component';
import { I18nModule } from 'src/app/shared/i18n/i18n.module';
import { FooterModule } from 'src/app/core/footer/footer.module';

const routes: Routes = [
  {
    path: "",
    component: RoleListComponent,
    data: { title: 'Role list',module: "Role", action: "list" }
  },
  {
    path: "add",
    component: RoleAddComponent,
    data: { title: 'Add Role',module: "Role", action: "add" }
  },
  {
    path: 'edit/:id',
    component: RoleAddComponent,
    data: { title: 'Update Role' ,module: "Role", action: "edit"}
  }
]

@NgModule({
  declarations: [RoleAddComponent, RoleListComponent],
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
    FooterModule
  ],
})
export class RoleModule { }
