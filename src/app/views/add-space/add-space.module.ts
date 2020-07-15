import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddSpacceComponent } from './add-spacce.component';
import { AddSpacceRoutingModule } from './add-space-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { HttpClientModule, HttpClient} from '@angular/common/http';
import { Http, Response } from '@angular/http';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    FormsModule,
    AddSpacceRoutingModule,
    FormsModule, // for FullCalendar!
    ModalModule.forRoot(),
    NgxPaginationModule,
    CommonModule,
    BsDropdownModule,
    PopoverModule,
    HttpClientModule,
    ToastrModule.forRoot(),

  ],
  declarations: [ AddSpacceComponent ]
})
export class AddSpacceModule { }
