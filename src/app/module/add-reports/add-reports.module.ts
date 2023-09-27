import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MaterialExModule } from 'src/app/shared/material.module';
import { I18nModule } from 'src/app/shared/i18n/i18n.module';
import { FooterModule } from 'src/app/core/footer/footer.module';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    MaterialExModule,
    I18nModule,
    FooterModule
  ]
})
export class AddReportsModule { }
