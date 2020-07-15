import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddEmployeeComponent } from './add-employee.component';
import { EmployeeRoutingModule } from './employee-routing.module';
// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpClientModule, HttpClient} from '@angular/common/http';
import { Http, Response } from '@angular/http';
import { CommonModule } from "@angular/common";
import { NgxLoadingModule } from 'ngx-loading';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrModule } from 'ngx-toastr';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PopoverModule } from 'ngx-bootstrap/popover';

@NgModule({
  imports: [
    FormsModule,
    EmployeeRoutingModule,
    FormsModule, // for FullCalendar!
    HttpClientModule,
    ModalModule.forRoot(),
    CommonModule,
    BsDropdownModule,
    PopoverModule,
    NgxPaginationModule,
    ToastrModule.forRoot(),
    NgxLoadingModule
  ],
  declarations: [ AddEmployeeComponent ]
})
export class EmployeeModule { }
