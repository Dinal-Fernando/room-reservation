import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddSpacceComponent } from './add-spacce.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Space'
    },
    children: [
      {
        path: '',
        redirectTo: 'add-spacce'
      },
      {
        path: 'add-spacce',
        component: AddSpacceComponent,
        data: {
          title: 'Add Space'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddSpacceRoutingModule {}
