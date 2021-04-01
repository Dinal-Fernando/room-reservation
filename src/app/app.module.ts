import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';
import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { HttpClientModule, HttpClient  } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
  
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';
import { CalendarComponent } from './views/calendar/calendar.component';
import { AddEmployeeComponent } from './views/employee/add-employee.component';
import { SettingsComponent } from './views/settings/settings.component';
import { ReportsComponent } from './views/reports/reports.component';
import {Ng2TelInputModule} from 'ng2-tel-input';

//import { OwlDateTimeModule, OWL_DATE_TIME_FORMATS} from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { CategoryComponent } from './views/category/category.component';
import { FormsModule }   from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';

import { NgxLoadingModule } from 'ngx-loading';
import { ToastrModule } from 'ngx-toastr';
import { CommonServicesService } from './services/common-services.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip/ngx-bootstrap-tooltip';
import { AlertModule } from 'ngx-bootstrap/alert/ngx-bootstrap-alert';
import { ModalModule } from 'ngx-bootstrap/modal/ngx-bootstrap-modal';
import { AddSpacceComponent } from './views/add-space/add-spacce.component';
import { DayComponent } from './views/bookings/day/day.component';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    HttpModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    Ng2TelInputModule,
    ChartsModule,
    CommonModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlMomentDateTimeModule,
    OwlNativeDateTimeModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
    NgxLoadingModule,
    MatTabsModule,
    ToastrModule.forRoot()
  ],
  declarations: [
    AppComponent,
    DefaultLayoutComponent,
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,
    CalendarComponent,
   
  ],
  providers: [
    {
    provide: LocationStrategy,
    useClass: HashLocationStrategy,
    },
    
    CommonServicesService,
],
  bootstrap: [ AppComponent ],
 
})
export class AppModule { }
