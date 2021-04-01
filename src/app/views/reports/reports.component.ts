import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { CategoryService } from '../category/category.service';
import { ToastrService } from 'ngx-toastr';
import { BookingsService } from '../bookings/bookings.service';
import {formatDate} from '@angular/common';
import { DatePipe } from '@angular/common';
import * as jsPDF from 'jspdf'

import * as moment from 'moment';
import { TreeNode } from 'primeng/primeng'

@Component({
  selector   : 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls  : ['./reports.component.css'],
  providers  : [DatePipe]
})

export class ReportsComponent implements OnInit {
  
  @ViewChild('htmlData') htmlData:ElementRef;
  is_loading: boolean = false;
  
  BookingsList: any[]=[];
  DetailsList: any[]=[];
  calendarEvents: any[];
  p: any;
  reportFromTime: any;
  reportToTime: any;
  myDate: string;
  details: any[];
  dataList: any[]=[];
  private _data: any;

  is_show_table = false
  reports= [];
  reportsDetailsList: any[]=[];
  constructor(
    private router: Router,
    public http: Http,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private bookingService : BookingsService,
    private route: ActivatedRoute ,
    private datePipe: DatePipe) {  
    this.myDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }
   
    ngOnInit() {
      console.log(this.myDate);
      this.getEventForReports(this.myDate,this.myDate);
      //this.addDuration();
    }

    currentPageLoad() {
      this.pageChanged();
    }
  
    pageChanged() {
      this.is_loading = true
      this.DetailsList = []
      this.router.navigate(['/reports/reports'])
      this.getEventForReports(this.reportFromTime,this.reportToTime);
    }

    getBookingsList() {
      this.is_loading = true;
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
    
    public openPDF():void {
      let DATA = this.htmlData.nativeElement;
      let doc = new jsPDF('p','pt', 'a4');
      doc.fromHTML(DATA.innerHTML,15,15);
      doc.output('dataurlnewwindow');
    }
  
    public downloadPDF():void {
      let DATA = this.htmlData.nativeElement;
      let doc = new jsPDF('p','pt', 'a4');
  
      let handleElement = {
        '#editor':function(element,renderer){
          return true;
        }
      };
      doc.fromHTML(DATA.innerHTML,15,15,{
        'width': 200,
        'elementHandlers': handleElement
      });
  
      doc.save('angular-demo.pdf');
    }

    getReportFromTime(value){
      this.reportFromTime = value
      if(!(this.reportToTime ==null)){
        this.pageChanged()
      }
    }

    getReportToTime(value){
      this.reportToTime = value
      if(!(this.reportFromTime ==null)){
        console.log("Srike ")
        this.pageChanged() 
      }
    }
    
    getEventForReports(from,to){
      this.is_loading = true;
      console.log("From: "+ from+ " To:"+to)
      this.bookingService.getBookingEventByDate(from, to )
      .then(
        res => {
          if (res && res['success']) {
            console.log("Success"+ res);
            this.is_loading= false;
            this.reports = res['data'];
            console.log(this.reports.length)
            // for(let i=0; i<this.reports.length;i++){
            //   this.reports.forEach(data=>{
            //     data.details.forEach(detailslist=>{
            //       this.reportsDetailsList.push(detailslist); 
            //     });
            //   });
            // }
            // console.log(this.reportsDetailsList);    
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
   
    // treeOptions: Options<any> = {
    //   capitalisedHeader: true,
    //   highlightRowOnHover: true,
    //   customColumnOrder: [
    //     'client', 'date', 'title', 'start', 'end','price', 'total'
    //   ]
    // };

    addDuration() {
      this.is_loading= true;
      this.bookingService.getBookingEventByDate(this.reportFromTime,this.reportToTime).then(
        res => {
          if (res && res['success']) {
            console.log("Success"+ res);
            this.is_loading= false;
              this.reports = res['data']
              console.log(this.reports)
              this.reports.forEach(data=>{
                data.details.forEach(detailslist=>{
                  this.DetailsList.push(detailslist); 
                });
              }); 
              console.log(this.DetailsList);
              return this.DetailsList;
          }
          else {
            this.toastr.error('Oops! Can not get item this moment please try again later');
          }     
        },
        err => {
          console.log(err);
        }
      );
    }

    onRowClicked(row) {
      console.log('Row clicked: ', row);
      this.dataList = row;
      this._data = row;
     console.log(this.dataList)
      console.log(row.id)
    }
    
    // logNode(node: Node<any>) {
    //   console.log(node);
    // }
}




