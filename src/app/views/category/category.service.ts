import { Injectable } from '@angular/core';
import { CommonServicesService} from '../../services/common-services.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from "@angular/common"
@Injectable({
  providedIn: 'root'
})

export class CategoryService {
   
  constructor(private http: HttpClient,
    private commonService: CommonServicesService) { } 

      addCategory(category){
         console.log("On submit values"+ category );
        return this.commonService.postData('category/save/', category);
      }

      updateCategory(id, category){
        return this.commonService.putData('category/update/?id='+id, category);
      }
      
      deleteCategory(id){
        console.log('category/delete/?id='+id);
        return this.commonService.deleteData('category/delete/?id='+id);
      }

      getCategory(){
        return this.commonService.getData('category/get/');
      }

      getCategoryByPage(page, limit ){
        return this.commonService.getData('category/getbypage/?page='+page+'&limit='+limit);
      }

      getSelectedCategory(id){
        return this.commonService.getData('category/getdetail/?id='+id);
      }

      changeCategoryActivation(category_id,category){
        return this.commonService.putData('category/update/?id='+category_id, category);
      }


  }