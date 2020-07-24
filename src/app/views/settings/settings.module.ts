import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';
// Tabs Component
import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
  imports: [
    FormsModule,
    SettingsRoutingModule,
    TabsModule
  ],
  declarations: [ SettingsComponent ]
})
export class SettingsModule { }
