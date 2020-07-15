import { Injectable } from '@angular/core';
import { CommonServicesService} from '../../services/common-services.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
//need to be changed 
  constructor(private http: HttpClient,
    private commonService: CommonServicesService) { }
    getRooms(page, limit){
      return this.commonService.getData('room/getbypage/?page='+page+'&limit='+limit);
    }

    addRooms(room){
      console.log('room/save/'+ room)
      return this.commonService.postData('room/save/', room);
    }

    updateRooms(id, room){
      return this.commonService.putData('room/update/?id='+id, room);
    }

    deleteRooms(id){
      return this.commonService.deleteData('room/delete/?id='+id);
    }

    getAllRooms(){
      return this.commonService.getData('room/get/');
    }

    getSelectedRooms(id){
      return this.commonService.getData('room/getdetail/?id='+id);
    }

    changeRoomActivation(room_id,room){
      return this.commonService.putData('room/update/?id='+room_id, room);
    }
    
}