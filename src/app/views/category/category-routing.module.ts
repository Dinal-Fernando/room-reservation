import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryComponent } from './category.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Category'
    },
    children: [
      {
        path: '',
        redirectTo: 'Category'
      },
      {
        path: 'category',
        component: CategoryComponent,
        data: {
          title: 'Category'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule {}
