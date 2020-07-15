import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Reportd'
    },
    children: [
      {
        path: '',
        redirectTo: 'reports'
      },
      {
        path: 'reports',
        component: ReportsComponent,
        data: {
          title: 'Reports'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule {}
