import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEmployeeComponent } from './add-employee.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Employee'
    },
    children: [
      {
        path: '',
        redirectTo: 'add-employee'
      },
      {
        path: 'add-employee',
        component: AddEmployeeComponent,
        data: {
          title: 'Add employee'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule {}
