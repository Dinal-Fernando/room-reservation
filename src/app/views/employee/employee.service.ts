import { Injectable } from '@angular/core';
import { CommonServicesService} from '../../services/common-services.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {
  constructor(private http: HttpClient,
    private commonService: CommonServicesService) { }
    /*
    getCustomer(page, limit ){
      return this.commonService.getData('user/getdealerbypage/?page='+page+'&limit='+limit);
    }*/
    registerAdminUser(adminUser) {
      return this.commonService.postData('user/update/', adminUser);
    }

    addUser(user){
      console.log("On submit values"+ user );
      return this.commonService.postData('user/save/', user);
    }

    verifyUser(user){
      return this.commonService.postData('user/varify/', user);
    }

    updateUser(user){
      return this.commonService.postData('user/update/', user);
    }

    getAllUser(page,limit){
      return this.commonService.getData('user/getall/?page='+page+'&limit='+limit);
    }

    getUserTypeA(){
      return this.commonService.getData('user/gettypes/');
    }

    changeUserActivation(user){
      return this.commonService.postData('user/update/',user);
    }

    
}