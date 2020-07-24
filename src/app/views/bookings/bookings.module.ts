import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DayComponent } from './day/day.component';
import { MonthComponent } from './month/month.component';
import { ListComponent } from './list/list.component';

// Theme Routing
import { BookingRoutingModule } from './bookings-routing.module';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!
// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';
//BookingRoutingModule
// Tabs Component
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import {MatTabsModule} from '@angular/material'
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

//callap
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  declarations: [
    DayComponent,
    MonthComponent, 
    ListComponent],
  imports: [
    CommonModule,
    TabsModule,
    BookingRoutingModule,
    CollapseModule,
    FullCalendarModule,
    FormsModule, // for FullCalendar!
    ReactiveFormsModule,
    ModalModule.forRoot(),
    NgxPaginationModule,
    CommonModule,
    BsDropdownModule,
    PopoverModule,
    HttpClientModule,
    MatTabsModule,
    ToastrModule.forRoot(),
    BsDropdownModule.forRoot(), 
    NgxIntlTelInputModule
  ]
})
export class BookingsModule { }
