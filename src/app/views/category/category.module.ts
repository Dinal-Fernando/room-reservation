import { NgModule, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryComponent } from './category.component';
import { CategoryRoutingModule } from './category-routing.module';
import { HttpClientModule, HttpClient} from '@angular/common/http';
import { Http, Response } from '@angular/http';
import {NgxPaginationModule} from 'ngx-pagination';
import { ToastrModule } from 'ngx-toastr';
// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule } from "@angular/common";
import { NgxLoadingModule } from 'ngx-loading';
@NgModule({
  imports: [
    FormsModule,
    CategoryRoutingModule,
    HttpClientModule,
    CommonModule,
    ModalModule.forRoot(),
    NgxPaginationModule,
    ToastrModule.forRoot(),
    NgxLoadingModule
    
  ],
  declarations: [ CategoryComponent ],
  providers: [],
})
export class CategoryModule{}
