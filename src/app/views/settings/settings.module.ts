import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';
// Tabs Component
import { TabsModule } from 'ngx-bootstrap/tabs';
import {MatTabsModule} from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    SettingsRoutingModule,
    TabsModule,
    MatTabsModule,
    ToastrModule.forRoot(),
    BsDropdownModule.forRoot(), 
    HttpClientModule,
    ModalModule.forRoot(),
  ],

  declarations: [ SettingsComponent ]
})
export class SettingsModule { }
