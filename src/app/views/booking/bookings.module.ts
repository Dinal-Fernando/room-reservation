import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingsRoutingModule } from './bookings-routing.module';
import { DayComponent } from './day.component';
import { MonthComponent } from './month/month.component';
import { ListComponent } from './list/list.component';


@NgModule({
  declarations: [
     DayComponent,
     MonthComponent, 
     ListComponent],
  imports: [
    CommonModule,
    BookingsRoutingModule
  ]
})
export class BookingsModule { }
