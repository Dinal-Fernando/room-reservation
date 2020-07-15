import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef  } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { FormBuilder, FormGroup, FormArray, FormControl, Form, Validators } from '@angular/forms';
import { Calendar } from '@fullcalendar/core';
import listPlugin from '@fullcalendar/list';
import { EventInput } from '@fullcalendar/core';
import { __param } from 'tslib';
import timeGrigPlugin from '@fullcalendar/timegrid';
//import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import { OptionsManager } from '@fullcalendar/core/OptionsManager';
import { ModalDirective} from 'ngx-bootstrap/modal';
import { RoomsService} from '../../add-space/rooms.service'
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { CategoryService } from '../../category/category.service';
import { ToastrService } from 'ngx-toastr';
import { BookingsService } from '../bookings.service';
import { OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { InputElement } from './inputElements';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { formatTimeZoneOffset } from '@fullcalendar/core/datelib/formatting';
import { analyzeAndValidateNgModules, identifierModuleUrl } from '@angular/compiler';
import { stringify } from 'querystring';
import { getInterpolationArgsLength } from '@angular/compiler/src/render3/view/util';

declare var $:any;
@Component({
  selector: 'app-day',
  templateUrl: 'day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit {
    @ViewChild('calendar') calendarComponent: FullCalendarComponent; // the #calendar in the template
    @ViewChild('primaryModal') public primaryModal: ModalDirective;
    @ViewChild('detailModal') public detailModal: ModalDirective;
    @ViewChild('activeModal') public activeModal: ModalDirective;
    @ViewChild('external') external: ElementRef;
      
      calendarVisible = true;
      calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin,listPlugin,resourceTimelinePlugin,bootstrapPlugin];
      calendarWeekends = true;
      resourcecolumns = [
        {
          labelText: 'Room',
     
          field: 'room_number'
        }
      ];
      resourcelist = [];

      calendarEvents: EventInput[] = [];

      rooms: any[];
      roomList :any[]=[];

      inputelements = [{id: 'number',roomNumber: 'string',checkin:'string',checkout:'string', price:'string'}];

      public form:{
        inputelements :InputElement[];
      };
      
      room_id  : string;
      check_in : string;
      check_out: string;
      checkin_value: any;
      checkout_value: any;
      checkin: any;
      price  :number;

      isDisabled=false;

      is_loading = false
      is_page_loading = false;
      inputelement: any;
      inputelementcheckin: any;
      inputelementcheckout: any;
      eventBgColor: string;
      height: number;
      contentHeight: number;
      resourceAreaWidth: number; 
      eventStartEditable: boolean;
      eventDurationEditable: boolean;
      dragRevertDuration: boolean;
      defaultView: string;
      showModal: boolean;
      eventLimit: true;
      name:string;
      date:string;
      personsForm: FormGroup;
      calendarOptions: OptionsManager;
      owlDateTimeTrigger: string;
      owlDateTime:string;

      index : any;

      navLinks: true; // can click day/week names to navigate views
      businessHours: true;// display business hours
      editable: true;
  
      navLinkDayClick= function(date, jsEvent) {
        console.log('day', date.toISOString());
        console.log('coords', jsEvent.pageX, jsEvent.pageY);
      }

      separateDialCode = true;
      SearchCountryField = SearchCountryField;
      TooltipLabel = TooltipLabel;
      CountryISO = CountryISO;
      preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

      BookingsList: any[];
      DetailsList: any[]=[];
      EventDetail: any[]=[];

      selected_room_number: any;
      selected_reservation_date: any;
      selected_reservaton_time: any;
      selected_client_name: any;
      selected_room_price: any;
      selected_dial_code: any;
      selected_mobile: any;
      selected_employee: any;
      selected_date: any;
  
      DetailsBookingList: any[]=[];
      selected_checkin: any;
      selected_checkout: any;
      total: number = 0;
      total_price: number;
      total_detail_price: any;
      selected_check_checkedout: any;
      selected_event_id: any;
      selected_check_cancelled: any;
      detailsForm:FormGroup;
      sum: number;
      reservation_date: any;
      roomy
      selectedOption: any;


      constructor(
        private roomService:RoomsService,
        private router: Router,
        private route: ActivatedRoute,
        public  http: Http,
        private bookingService : BookingsService,
        private toastr: ToastrService,
        private cd: ChangeDetectorRef,
        private fb:FormBuilder
      ){
        this.detailsForm = fb.group({
        client_name: ["", Validators.required],
        phone: ["", Validators.required],
        nic: ["", Validators.required],
        email:["", Validators.required],
        details :this.fb.array([this.newDetail()]),
        total:["", Validators.required]
        });
      }


      ngOnInit(){
        this.getRoomsList();
        this.getEventList(); 
        console.log(this.roomy)
      }
    
     details(): FormArray {
        return this.detailsForm.get("details") as FormArray
      }

      newDetail(): FormGroup {
        return this.fb.group({
          room: ['', Validators.compose([Validators.required])],
          checkin    : ['', Validators.compose([Validators.required])],
          checkout   : ['', Validators.compose([Validators.required])],
          price      : ['', Validators.compose([Validators.required])],
        });
      }

      currentPageLoad() {
        this.router.navigateByUrl('/').then(
          () => {this.router.navigateByUrl('/bookings/day');});
      }

      addDetail() {
        console.log("Adding a detail");
        this.details().push(this.newDetail());
      }
     
     
      removeDetail(empIndex:number) {
        if(this.details().length !=1){
        this.details().removeAt(empIndex);
      }
      }

      getContactsFormGroup(index): FormGroup {
        // this.contactList = this.form.get('contacts') as FormArray;
        const formGroup = this.details().controls[index] as FormGroup;
        return formGroup;
      }

      changedFieldType(index) {
       console.log(this.detailsForm.value);
       console.log(this.getContactsFormGroup(index).controls.value)
       const room_number= this.getContactsFormGroup(index).controls['room_number'].value
       const price= this.getContactsFormGroup(index).controls['price'].value    
       console.log("Whharr"+ room_number )    
      }

      gotoPast() {
        let calendarApi = this.calendarComponent.getApi();
        calendarApi.gotoDate('2000-01-01'); // call a method on the Calendar object
      }

      getTotal(){
        this.sum = 0;
        this.details().value.forEach(x => {
              this.sum += +x.price;
        });
        this.detailsForm.controls['total'].setValue(this.sum);
        console.log( this.detailsForm.controls['total'].setValue(this.sum));
      }
        // //When u select some space in the calendar do the following:
        // select= function (start, end, allDay) {
        //   //do something when space selected
        //   //Show 'add event' modal
        //   $('#createEventModal').modal('show');
        // }

        // //When u drop an event in the calendar do the following:
        // eventDrop= function (event, delta, revertFunc) {
        //     //do something when event is dropped at a new location
        // }

        // //When u resize an event in the calendar do the following:
        // eventResize= function (event, delta, revertFunc) {
        //     //do something when event is resized
        // }

        // eventRender= function(event, element) {
        //     $(element).tooltip({title: event.title});             
        // }

        // addMore() {
        //   this.inputelements.push({roomNumber: '',checkin:'',checkout:''});
        // }

     
        // get demoArray() {
        //   return this.demoForm.get('demoArray') as FormArray;
        // }
        
        // addItem(item) {
        //     this.arrayItems.push(item);
        // }

        // removeItem() {
        //     this.arrayItems.pop();
        //     this.demoArray.removeAt(this.demoArray.length - 1);
        // }

        // registrationForm = this.fb.group({
        //   addDynamicElement: this.fb.array([])
        // })

          //   /*############### Add Dynamic Elements ###############*/
          //   get addDynamicElement() {
          //     return this.registrationForm.get('addDynamicElement') as FormArray
          //   }

          // addItems() {
          //   this.addDynamicElement.push(this.fb.control(''))
          // }

          getRoomsList() {
            this.roomService.getRooms(1, 1000).then(
              res => {
                if (res['success']) {
                  this.resourcelist = res['data'];
                  for(var i = 0; i < this.resourcelist.length; i++) {
                    if (this.resourcelist[i].is_active == true) {
                      this.roomList.push(this.resourcelist[i]);
                    }
                  }               
                  console.log( this.roomList);
                  return this.roomList;         
                }
              },
              err => {        
                console.log(err);
              }
            );
          }


      getCheckInTIme(index){
        var todaysDatee = new Number(new Date());
        const checkin= this.getContactsFormGroup(index).controls['checkin'].value
        this.check_in = checkin;       
        if(Date.parse(this.check_in)< todaysDatee ){
          this.getContactsFormGroup(index).controls['checkin'].value == null
          this.toastr.error('Oops! Make sure date is not a past date');     
        }
      }

      getCheckOutTIme(index){
        var roomid = this.getContactsFormGroup(index).controls['room'].value
        var checkin =   this.getContactsFormGroup(index).controls['checkin'].value
        var checkout =  this.getContactsFormGroup(index).controls['checkout'].value
        this.check_out = index;
        let model = {
          room    : roomid,
          checkin : checkin,
          checkout: checkout
        }    
        this.bookingService.checkCheckInOutTime(model).then(
          res => {
            this.is_loading = false
            if (res['validity']) {
              this.toastr.success('Room is available!');
            } else {
              this.toastr.error('Oops!There is a booking made at this time');
            }
          },
          err => {
            this.is_loading = false
            this.toastr.error('Oops! Internal Server Error');
          }
        );
      }

      getRoomID(index){
        console.log("YOYO"+index)
        var client_name = this.detailsForm.value.client_name
        var nic = this.detailsForm.value.nic
        var mobile = this.detailsForm.value.phone
        var countryCode = mobile.dialCode;
        var phone = mobile.number.replace(/\s/g, ""); ;
        var emailAddress =this.detailsForm.value.email
        console.log("clentname"+countryCode);
        console.log("clentname"+client_name);
      }
      
      selected(event,id){
        for (let i=0; i< this.roomList.length;i++){
          if(this.roomList[i].id == event){
              this.details().controls[id].get('price').setValue(this.roomList[i].price)
            }
        }       
      }

    public addInputElement(): void{
      this.form.inputelements.push({
        id         : Date.now(),
        room_number: "" ,  // <--- uniqueness hook.
        checkin    : "" ,
        checkout   : "" ,
        price      : ""
      });
    }
    get client_name() { return this.detailsForm.get('client_name'); }
    get nic() { return this.detailsForm.get('nic'); }
    get mobile() { return this.detailsForm.get('phone'); }
    get email() { return this.detailsForm.get('email'); }


    public processForm( form: any ) : void {    
      let intDate = +new Date()
      this.is_loading = true
      console.warn( "Handling form submission!" );
     
      console.group( "Form Data" );
      console.log( this.detailsForm.value );
      console.groupEnd();
   
      console.group( "Form Model" );
      console.groupEnd();

      var client_name = this.detailsForm.value.client_name
      var nic = this.detailsForm.value.nic
      var mobilee = this.detailsForm.value.phone
      var countryCode = mobilee.dialCode;
      var phonee = mobilee.number.replace(/\s/g, ""); ;
      var emailAddress =this.detailsForm.value.email;
      
      console.log("sds"+phonee)
      console.log( this.details())
      let Form = JSON.stringify(this.details);
      console.log(this.detailsForm.value.details);

      
    //   for(let i = 0; i<this.details().length; i++){ 
    //     if(this.details().at(i).get('checkin')  <this.details().at(i+1).get('checkin')){
    //       this.reservation_date = this.details().at(i).get('checkin')
    //     }
    //  } 

      let model ={
        "client":{
          name: client_name,
          nic : nic,
          country_code : countryCode,
          mobile : phonee,
          email :emailAddress
        },
        "reservation":{
           checkin: this.details().at(0).get('checkin').value,
           total  : this.sum
        },
        "detail":this.detailsForm.value.details
      }

      this.bookingService.saveBookings(model).then(
        res => {
          if (res['success']) {
            this.is_loading = false 
            this.detailsForm.reset();  
            this.primaryModal.hide();
            this.toastr.success('Successfully Added!');    
            this.currentPageLoad();
          } else {
            this.is_loading= false
            this.toastr.error('Oops! Can not add bookings at this moment please try again later');
          }
        },
        err => {
          this.is_loading = false
          this.toastr.error('Oops! Internal Server Error');
        }
      );
    }

  getEventList(){
    this.is_loading = true
    this.bookingService.getBookingEventsList()
    .then(
      res => {
        if (res && res['success']) {
          this.is_loading = false
          console.log("Its a success"); 
          console.log(res['data']);
          this.BookingsList = res['data'];
          console.log("22");
          this.BookingsList.forEach(data=>{
            data.details.forEach(detailslist=>{
              this.DetailsList.push(detailslist); 
            });
          });
          console.log(this.DetailsList);
          this.calendarEvents= this.DetailsList;
          return this.DetailsList;
        }
        else {
          this.toastr.error('Oops! Can not get item this moment please try again later');
        }
      },
      err=>{
        this.is_loading = false
        this.toastr.error('Oops! Internal Server Error');
      }
    );
  }

  showModel(id){
    this.detailModal.show();
    this.getEventDetails(id);
  }
 
  eventClick(info){
    this.is_loading = true;
    this.bookingService.getBoookingEventDetail(info.event.id)
    .then(
      res => {
        if (res && res['success']) {
          for(let i=0; i <= this.DetailsBookingList.length ;i++){
            this.DetailsBookingList.pop();
          }
          
          this.is_loading = false
          this.EventDetail = res['data'];
          console.log(this.EventDetail);
          this.selected_client_name = this.EventDetail[0]["client"]
          this.selected_dial_code = this.EventDetail[0]["country_code"]
          this.selected_mobile= this.EventDetail[0]["mobile"]
         
          this.selected_employee = this.EventDetail[0]["user"]

          this.selected_room_number = this.EventDetail[0]["details"]["title"]
          this.selected_checkin = this.EventDetail[0]["details"]["start"]
          this.selected_checkout= this.EventDetail[0]["details"]["end"]

          this.selected_date = info.event.date
          this.selected_check_checkedout = this.EventDetail[0]["is_checkedout"]
          this.selected_check_cancelled = this.EventDetail[0]["is_cancelled"]
          this.EventDetail.forEach(data=>{
            data.details.forEach(detailsbookinglist=>{
              this.DetailsBookingList.push(detailsbookinglist); 
            });
          });
          this.total_detail_price = this.EventDetail[0]["total"]  
          this.selected_event_id = this.EventDetail[0]["id"]  
          this.detailModal.show();
        }
        else {
          this.toastr.error('Oops! Can not get item this moment please try again later');
        }
      },
      err=>{
        this.is_loading = false
        this.toastr.error('Oops! Internal Server Error');
      }
    );
  }

  getEventDetails(id){
    console.log("Id "+id);
    //this.is_loading = true
    // this.bookingService.getBoookingEventDetail(id)
    // .then(
    //   res => {
    //     if (res && res['success']) {
    //       this.is_loading = false
    //       this.EventDetail = res['data'];
    //       console.log("22");
    //       // this.BookingsList.forEach(data=>{
    //       //   data.details.forEach(detailslist=>{
    //       //     this.DetailsList.push(detailslist); 
    //       //   });
    //       // });
    //       // console.log(this.DetailsList);
    //       // this.calendarEvents= this.DetailsList;
    //       // return this.DetailsList;
    //     }
    //     else {
    //       this.toastr.error('Oops! Can not get item this moment please try again later');
    //     }
    //   },
    //   err=>{
    //     this.is_loading = false
    //     this.toastr.error('Oops! Internal Server Error');
    //   }
    // );
  }
  close(){
    this.detailsForm.reset()
    this.primaryModal.hide()
  }

  cancelEve(info){
    console.log(info)
  }
  showCancelMde(){
    this.detailModal.hide();
    this.activeModal.show();
  }

}