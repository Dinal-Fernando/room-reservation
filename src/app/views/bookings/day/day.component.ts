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
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { formatTimeZoneOffset } from '@fullcalendar/core/datelib/formatting';
import { analyzeAndValidateNgModules, identifierModuleUrl } from '@angular/compiler';
import { stringify } from 'querystring';
import { getInterpolationArgsLength } from '@angular/compiler/src/render3/view/util';
import { convertActionBinding } from '@angular/compiler/src/compiler_util/expression_converter';

declare var $:any;
@Component({
  selector: 'app-day',
  templateUrl: 'day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit {
    @ViewChild('calendar') calendarComponent: FullCalendarComponent; // the #calendar in the template
    @ViewChild('largeModal') public largeModal: ModalDirective;
    @ViewChild('detailModal') public detailModal: ModalDirective;
    @ViewChild('activeModal') public activeModal: ModalDirective;
    @ViewChild('external') external: ElementRef;
    @ViewChild('checkoutModal') public checkoutModal: ModalDirective;

      public innerWidth: any;
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
      roomCalendarEvents: EventInput[]=[]
      
      rooms: any[];
      roomList :any[]=[];
      roomEventList: any[];

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
      height: number;
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

      CountryISO = CountryISO;
      preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

      BookingsList: any[];
      DetailsList: any[]=[];
      EventDetail: any[]=[];

      formloader =false;
      clicked: boolean;
      isCollapsed: boolean[];

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
      sum : number;
      reservation_date: any;
      roomy
      selectedOption: any;
      show: boolean;
      selected_add_reason: any;
      checkoutDisabled: any;
      showEvents: boolean;
  
      mealList: any[];
      channelList: any[];
      methodList: any[];
      selectedItemsList: any;
      checkedIDs: any[];
    
      channelNumber 
      methodNumber: number;
      amountNumber: any;
      phoneNumber: number;
      checkedList: any[]=[];
      mealName: any;
      mealPrice: any;
      selected_meal  = [];
      empIndex: any = 0;
      selected_meal_array: any;

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
        total:["", Validators.required],
        channel:["", Validators.required],
        method:["", Validators.required],
        amount: ["", Validators.required]
        });
      }

      ngOnInit(){
        this.innerWidth = window.innerWidth;
        this.getRoomsList();
        this.getEventList(); 
        this.getMealsList();
        this.getMethodList();
        this.getChannelList();
        //console.log(this.roomy);
        //this.cd.detectChanges();
        // this.fetchSelectedItems();
        // this.fetchCheckedIDs();
      }
    
      details(): FormArray {
        return this.detailsForm.get("details") as FormArray
      }

      detailsMeals(empIndex:number) : FormArray {       
        return this.details().at(empIndex).get("meals") as FormArray
      }

      checked : boolean;
      newDetail(): FormGroup {
        return this.fb.group({
          room     : ['', Validators.compose([Validators.required])],
          checkin  : ['', Validators.compose([Validators.required])],
          checkout : ['', Validators.compose([Validators.required])],
          price    : ['', Validators.compose([Validators.required])],
          adults   : ['', Validators.compose([Validators.required])],
          children : ['', Validators.compose([Validators.required])],
          meals    :  this.fb.array([])})
      }

      newDetail2(empIndex): FormGroup {
        return this.fb.group({
          room     : ['', Validators.compose([Validators.required])],
          checkin  : ['', Validators.compose([Validators.required])],
          checkout : ['', Validators.compose([Validators.required])],
          price    : ['', Validators.compose([Validators.required])],
          adults   : ['', Validators.compose([Validators.required])],
          children : ['', Validators.compose([Validators.required])],
          meals    :  this.detailsMeals(empIndex)})
      }
      
      getList() {
        if (this.mealList) {
          console.log(this.details.length + " details");
          for(let j=0; j <1; j++){
            for(let i=0; i<this.mealList.length; i++){
              let ccc = this.mealList[i]
              console.log(ccc.meal + "mealList")
              this.addMeals(j, ccc.meal, ccc.price)
            }
          }
        } 
      }

      newMeal(meal, price):FormGroup{
        return this.fb.group({
          meal     : [ meal, Validators.compose([Validators.required])],
          price    : [ price, Validators.compose([Validators.required])]
        });
      }

      addMeals(empIndex:number, meal, price) {
         this.detailsMeals(empIndex).push(this.newMeal(meal,price));
      }
  
      getMeal(empIndex:number, meal, price){
        this.detailsMeals(empIndex).push(this.newMeal(meal,price));
      }

      currentPageLoad() {
        this.router.navigate(['/bookings/day']);
        // this.router.navigateByUrl('/').then(
        //   () => {this.router.navigateByUrl('/bookings/day');});
      }

      addDetail(empIndex) {
        console.log("Adding a detail");
        // this.getList()
        this.details().push(this.newDetail2(empIndex));
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

      getQuestions(form) {
         return form.controls.meals.controls;
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

      toggleClickedCheckOut(event){
        if(this.selected_check_checkedout){
          alert("Client is already checked out. Checkout cannot be undone.")     
        }else{
        this.is_loading = true
        console.log(event)
        let model ={
          id:event
        }
        if (confirm('Are you sure you want to checkout ? Note: This cannot be undone!')) {
          this.bookingService.checkout(model).then(
            res => {
              this.is_loading = false
              if (res['success']) {
                this.toastr.success("Client Checked Out !!");
              }else{
                this.toastr.error("Something not right!");
              }
            });
        } else {
          this.toastr.success("Checkout cancelled !!");
        }
          this.detailModal.hide();
        }
      }
      
      toggleClickedCancel(){
        if(this.selected_check_cancelled){
          alert("Oops !The booking is already cancelled!!");   
        }else{ 
        this.show = !this.show;
        }
      }
 
      onCheckChange(empIndex,order, id, det, menu, price, event){
        console.log("Menu")
        console.log(menu)
        console.log(id)
    
        if(event.target.checked){
          if(order.value.meal === true && order.value.price === ""){
            this.mealName  = menu
            this.mealPrice = price
          }else if(order.value.meal === true && order.value.price === !null ){
            this.mealName  = menu
            this.mealPrice = order.value.price
          }
        } else {
        // for(var i=0 ; i < this.mealList.length; i++) {
        //   if(this.checkedList[i] == order.value.id) {
        //     this.checkedList.splice(i,1);
        //  }
        // }
       }
        console.log(this.checkedList);
    }
     
        // const checkboxControl = (this.checkboxGroup.controls.checkboxes as FormArray);
        // const formValue = { 
        //   ...this.checkboxGroup.value,
        //   checkboxes: checkboxControl.value.filter(value => !!value)
        // }
        // // this.submittedValue = formValue;
        // const formArray: FormArray = this.meals.get('myChoices') as FormArray;
      
        // /* Selected */
        // if(event.target.checked){
        //   // Add a new control in the arrayForm
        //   formArray.push(new FormControl(event.target.value));
        // }
        // /* unselected */
        // else{
        //   // find the unselected element
        //   let i: number = 0;
      
        //   formArray.controls.forEach((ctrl: FormControl) => {
        //     if(ctrl.value == event.target.value) {
        //       // Remove the unselected element from the arrayForm
        //       formArray.removeAt(i);
        //       return;
        //     }
      
        //     i++;
        //   });
    
      
      onChangeClick(event){
        console.log("Event click");
        console.log(event);
      }

      cancelReason(selectedID){
        this.is_loading = true
        let model={
          id           :selectedID,
          cancel_reason:this.selected_add_reason
        }
        if (confirm('Are you sure you want to cancel booking ? Note: This cannot be undone!')) {
          this.bookingService.cancel(model).then(
            res => {
              this.is_loading = false
              if (res['success']) {
                this.toastr.success(" Booking cancelled!!");
                this.show = !this.show;
              }else{
                this.toastr.error("Something not right!");
                this.show = !this.show;
              }
            });
        } else {
          this.toastr.success("Cancellation stopped!!");
        }
          this.detailModal.hide(); 
        }

          getRoomsList() {
            this.roomService.getRooms(1, 1000).then(
              res => {
                if (res['success']) {
                  this.is_loading = false
                  this.resourcelist = res['data'];
                  for(var i = 0; i < this.resourcelist.length; i++) {
                    if (this.resourcelist[i].is_active == true) {
                      this.roomList.push(this.resourcelist[i]);
                    }
                  }               
                  return this.roomList;         
                }
              },
              err => {        
                console.log(err) ;
              }
            );      
          }

        getMealsList() {
          this.roomService.getMeals().then(
            res => {
              if (res['success']) {
                this.mealList = res['data'];
                this.getList()        
              }
            },
            err => {        
              console.log(err);
            }
          );      
        }

        getChannelList() {
          this.roomService.getChannel().then(
            res => {
              if (res['success']) {
                this.channelList = res['data'];
                return this.channelList;         
              }
            },
            err => {        
              console.log(err);
            }
          );      
        }

        getMethodList(){
          this.roomService.getMethods().then(
            res => {
              if (res['success']) {
                this.methodList = res['data'];
                return this.methodList;         
              }
            },
             err => {        
              console.log(err);
            }
          );      
        }

        changeSelection() {
          this.fetchSelectedItems(); 
        }

        fetchSelectedItems() {
          this.selectedItemsList = this.mealList.filter((value, index) => {
            return value.isChecked
          });
        }
      
        fetchCheckedIDs() {
          this.checkedIDs = []
          this.mealList.forEach((value, index) => {
            if (value.isChecked) {
              this.checkedIDs.push(value.id);
            }
          });
        }
        
      getCheckInTIme(index){
        this.showEvents = true
        this.formloader = true 
        var todaysDatee = new Number(new Date());
        var roomid = this.getContactsFormGroup(index).controls['room'].value
        var checkin =   this.getContactsFormGroup(index).controls['checkin'].value
        var checkout =  this.getContactsFormGroup(index).controls['checkout'].value   
        this.check_in = checkin;       
        if(Date.parse(this.check_in) < todaysDatee ){
          this.getContactsFormGroup(index).controls['checkin'].value == null
          this.toastr.error('Oops! Make sure date is not a past date and after current time');  
          this.getContactsFormGroup(index).controls['checkin'].reset()
        }else if((checkout < checkin) && (checkout !=null) && (checkout !="") ){
          this.toastr.error('Oops! Make sure check out time is after check in time');  
          this.getContactsFormGroup(index).controls['checkin'].reset()
        }else if(!(roomid == "" ||roomid == null ) && !(checkin == ""||checkin == null) && !(checkout == ""||checkout == null)){
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
                this.showEvents  = !this.showEvents;
                this.formloader = false
              } else {
                this.toastr.error('Oops!There is a booking made at this time');
                this.formloader = false
                this.getContactsFormGroup(index).controls['checkin'].reset()
                this.getContactsFormGroup(index).controls['checkout'].reset()
              }
            },
            err => {
              this.is_loading = false
              this.formloader = false
              this.toastr.error('Oops! Internal Server Error');
            }
          );
          }
       }

      getCheckOutTIme(index){
        this.showEvents = true 
        this.formloader = true
        var todaysDatee = new Number(new Date());
        var roomid   = this.getContactsFormGroup(index).controls['room'].value
        var checkin  = this.getContactsFormGroup(index).controls['checkin'].value
        var checkout = this.getContactsFormGroup(index).controls['checkout'].value   
        this.check_in = checkin;     
        if(Date.parse(checkout) < todaysDatee) {
          this.toastr.error('Oops! Make sure date is not a past date');  
          this.getContactsFormGroup(index).controls['checkout'].reset()
        }else if(checkout < checkin){
          this.toastr.error('Oops! Make sure check out time is after check in time');  
          this.getContactsFormGroup(index).controls['checkout'].reset()
        }else
        if(!(roomid == "" ||roomid == null ) && !(checkin == ""||checkin == null) && !(checkout == ""||checkout == null)){
          var roomid = this.getContactsFormGroup(index).controls['room'].value
          var checkin =   this.getContactsFormGroup(index).controls['checkin'].value
          var checkout =  this.getContactsFormGroup(index).controls['checkout'].value   
          if(!(roomid == "" || checkin == null || checkout == null)){
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
                  this.showEvents = !this.showEvents
                  this.formloader = false
                } else {
                  this.toastr.error('Oops!There is a booking made at this time');
                  this.formloader = false
                  this.getContactsFormGroup(index).controls['checkin'].reset()
                  this.getContactsFormGroup(index).controls['checkout'].reset() 
                }
              },
              err => {
                this.is_loading = false
                this.formloader = false
                this.toastr.error('Oops! Internal Server Error');
              }
          );
        }
      }       
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
        this.formloader = true
        console.log("event" + event)
        for (let i=0; i< this.roomList.length;i++){
          if(this.roomList[i].id == event){
              this.details().controls[id].get('price').setValue(this.roomList[i].price)
            }
        }
        var roomid = this.getContactsFormGroup(id).controls['room'].value
        var checkin =   this.getContactsFormGroup(id).controls['checkin'].value
        var checkout =  this.getContactsFormGroup(id).controls['checkout'].value   
        this.check_in = checkin;
         if(!(roomid == "" ||roomid == null ) && !(checkin == ""||checkin == null) && !(checkout == ""||checkout == null)){
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
                this.showEvents = !this.showEvents;
                this.getContactsFormGroup(id).disable()
              } else {
                this.toastr.error('Oops!There is a booking made at this time');
                this.getContactsFormGroup(id).controls['checkin'].reset()
                this.getContactsFormGroup(id).controls['checkout'].reset() 
              }
            },
            err => {
              this.is_loading = false
              this.toastr.error('Oops! Internal Server Error');
            }
          );
        }
        
        this.bookingService.getRoomEventsById(id).then(
          res => {
            if (res['success']) {
              this.is_loading = false;
              this.roomEventList = res['data']; 
              this.showEvents = true 
              this.clicked = true
              this.roomCalendarEvents[id] = this.roomEventList;
              this.formloader = false
            } else {
              this.is_loading= false
              this.toastr.error('Oops! Room bookings are not found please try again later');
            }
          },
          err => {
            this.is_loading = false
            this.toastr.error('Oops! Internal Server Error');
          }
        );
        
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

   processForm( ) : void {    
      let intDate = +new Date()
      this.is_loading = true

      var client_name = this.detailsForm.value.client_name
      var nic = this.detailsForm.value.nic
      var mobilee = this.detailsForm.value.phone
      var countryCode = mobilee.dialCode;
      var phonee = mobilee.number.replace(/\s/g, ""); ;
      var emailAddress =this.detailsForm.value.email;

      var channel = this.detailsForm.value.channel 
      this.channelNumber = Number(channel);

      var method = this.detailsForm.value.method 
      this.methodNumber = Number(method);
      
      var amount = this.detailsForm.value.amount
      this.amountNumber = Number(amount);

      this.phoneNumber = Number(phonee);

      console.log( this.detailsForm.value.details)
    
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
           total  : this.sum,
           channel : this.channelNumber
        },
        "payments":{
          method : this.methodNumber,
          amount  :this.amountNumber
        },
        "detail": this.detailsForm.value.details
      }
      console.log(model)
      this.bookingService.saveBookings(model).then(
        res => {
          if (res['success']) {
            this.is_loading = false;
            this.detailsForm.reset();  
            this.largeModal.hide();
            this.toastr.success('Successfully Added!');    
            this.currentPageLoad();
          } else {
            this.is_loading= false;
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
         
          this.BookingsList = res['data'];
          
          this.BookingsList.forEach(data=>{
            data.details.forEach(detailslist=>{
              this.DetailsList.push(detailslist); 
            });
          });
         
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
          this.selected_check_cancelled = this.EventDetail[0]["is_canceled"]

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
    this.largeModal.hide();
  }

  cancelEve(info){
    console.log(info)
  }
  showCancelMde(){
    this.detailModal.hide();
    this.activeModal.show();
  }

  collaps(empIndex:number){
    this.isCollapsed[empIndex] = !this.isCollapsed[empIndex]
  }
  
  checkChange(j , empIndex,mealList, test){
    console.log("Work")
    
    for(let i=0; i<= empIndex ; i++){
      let selected =[]
        if(test){
          console.log(mealList.meal);
          let obj = {
            "meal" : mealList.id,
            "price" :mealList.price
          }

          let formdata = this.detailsForm.value.details[i]
          this.selected_meal.push(obj)
          formdata["meals"] =  this.selected_meal
          // this.selected_meal_array[empIndex]  = this.selected_meal[empIndex] 
          console.log(this.selected_meal)

        }else{
          this.selected_meal.splice(j,1);   
        }
      console.log( i)
    }
  }

}