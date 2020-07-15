import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
  imports: [
    FormsModule,
    SettingsRoutingModule,
 
  ],
  declarations: [ SettingsComponent ]
})
export class SettingsModule { }
