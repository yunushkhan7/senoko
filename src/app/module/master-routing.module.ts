import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterLayoutComponent } from '../core/layout/sidebar/master-layout.component';

const routes: Routes = [
  {
    path: '',
    component: MasterLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule),
      },
      {
        path: 'role',
        loadChildren: () => import('./role/role.module').then(m => m.RoleModule),
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
      },
      {
        path: 'report',
        loadChildren: () =>
          import('./reports/reports.module').then((m) => m.ReportsModule),
      },
      {
        path: 'user-account',
        loadChildren: () =>
          import('./user-accounts/user-accounts.module').then((m) => m.UserAccountsModule),
      },
      {
        path: 'visitors',
        loadChildren: () =>
          import('./visitors/visitors.module').then((m) => m.VisitorsModule),
      },
      {
        path: 'data-retention',
        loadChildren: () =>
          import('./data-retention/data-retention.module').then((m) => m.DataRetentionModule),
      },
      {
        path: 'acs-settings',
        loadChildren: () =>
          import('./acs-settings/acs-settings.module').then((m) => m.AcsSettingsModule),
      },
      {
        path: 'api-integration',
        loadChildren: () =>
          import('./api-integration/api-integration.module').then((m) => m.ApiIntegrationModule),
      },
      {
        path: 'ssaintegration',
        loadChildren: () =>
          import('./ssa-integration/ssa-integration.module').then((m) => m.SsaIntegrationModule),
      },
      {
        path: 'vms-station',                                     
        loadChildren: () =>
          import('./vms-station/vms-station.module').then((m) => m.VmsStationModule),
      },
      {
        path: 'terms-condition',
        loadChildren: () =>
          import('./terms-condition/terms-condition.module').then((m) => m.TermsConditionModule),
      },
      {
        path: 'logs',
        loadChildren: () =>
          import('./logs/logs.module').then((m) => m.LogsModule),
      }
      // {
      //   path: 'smtp',
      //   loadChildren: () =>
      //     import('./smtp/smtp.module').then((m) => m.SmtpModule),
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
