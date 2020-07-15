import { Injectable } from '@angular/core';
import { CommonServicesService} from '../../services/common-services.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  constructor(private http: HttpClient,
    private commonService: CommonServicesService) { }

    checkCheckInOutTime(roomtime){
      return this.commonService.postData('reservation/check/', roomtime);
    }

    saveBookings(bookings){
      return this.commonService.postData('reservation/save/',bookings);
    }

    getBookingEventsList(){
      return this.commonService.getData('reservation/get/');
    }
    
    getBoookingEventDetail(id){
      return this.commonService.getData('reservation/getdetail/?id='+id);
    }

    getBookingEventByDate(from, to){
      return this.commonService.getData('reservation/getreport/?first_date='+from+'&second_date='+to);
    }
}
