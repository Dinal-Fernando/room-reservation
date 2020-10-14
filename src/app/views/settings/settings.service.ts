import { Injectable } from '@angular/core';
import { CommonServicesService} from '../../services/common-services.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class SettingsService {
  constructor(private http: HttpClient,private commonService: CommonServicesService) { }

    addMeals(meal){
        return this.commonService.postData('reservation/savemeal/', meal);
    }

    updateMeals(id,meal){
       return this.commonService.putData('reservation/updatemeal/?id='+ id, meal);
    }

    deleteMeal(id){
       return this.commonService.deleteData('reservation/deletemeal/?id='+ id);   
    }

    getMeal(){
        return this.commonService.getData('reservation/getmeal/');
    }

    addChannel(channel){
        return this.commonService.postData('reservation/savechannel/', channel);
    }

    updateChannel(id, channel){
        return this.commonService.putData('reservation/updatechannel/?id='+ id, channel);
    }

    deleteChannel(id){
        return this.commonService.deleteData('reservation/deletechannel/?id='+ id);
    }

    getChannel(){
        return this.commonService.getData('reservation/getchannel/');
    }

    addPayment(method){
        return this.commonService.postData('reservation/savemethod/', method);
    }

    updateMethod(id,method){
        return this.commonService.putData('reservation/updatemethod/?id='+ id, method);
    }

    getMethod(){
        return this.commonService.getData('reservation/getmethod/');
    }

    deleteMethod(id){
        return this.commonService.deleteData('reservation/deletemethod/?id='+ id);
    }

}