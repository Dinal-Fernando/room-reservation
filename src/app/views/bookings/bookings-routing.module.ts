import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DayNewComponent } from './day-new/day-new.component';

import { DayComponent } from './day/day.component';
import { ListComponent } from './list/list.component';
import { MonthComponent } from './month/month.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Bookings'
    },
    children: [
      {
        path: '',
        redirectTo: 'day'
      },
      {
        path: 'day-new',
        component: DayNewComponent,
        data: {
          title: 'Day'
        }
      },
      {
        path: 'month',
        component: MonthComponent,
        data: {
          title: 'Month'
        }
      },
      {
        path: 'list',
        component: ListComponent,
        data: {
          title: 'List'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule {}
