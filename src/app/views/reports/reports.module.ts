import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrModule } from 'ngx-toastr';
import { NgxLoadingModule } from 'ngx-loading';

import {DpDatePickerModule} from 'ng2-date-picker';
import { TreeNode } from 'primeng/primeng';
// import { Node, Options } from 'ng-material-treetable';
// import { TreetableModule } from 'ng-material-treetable';

@NgModule({
  imports: [
    FormsModule,
    ReportsRoutingModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    ModalModule.forRoot(),
    NgxPaginationModule,
    ToastrModule.forRoot(),
    DpDatePickerModule,
    // TreetableModule,
    NgxLoadingModule
  ],
  declarations: [ ReportsComponent ]
})
export class ReportsModule { }
