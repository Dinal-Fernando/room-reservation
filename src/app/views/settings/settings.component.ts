import { Content } from '@angular/compiler/src/render3/r3_ast';
import { ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Channel } from './setting'
import { Meal } from './setting'
import { Method } from './setting'
import { Http } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { SettingsService } from './settings.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  @ViewChild('abc')abc: ElementRef;

  @ViewChild('addMealModal') public addMealModal: ModalDirective;
  @ViewChild('addMethodModal') public addMethodModal: ModalDirective;
  @ViewChild('addChannelModal') public addChannelModal: ModalDirective;

  @ViewChild('editMealModal') public editMealModal: ModalDirective;
  @ViewChild('editMethodModal') public editMethodModal: ModalDirective;
  @ViewChild('editChannelModal') public editChannelModal: ModalDirective;

  @ViewChild('deleteMealModal') public deleteMealModal: ModalDirective;
  @ViewChild('deleteMethodModal') public deleteMethodModal: ModalDirective;
  @ViewChild('deleteChanelModal') public deleteChanelModal: ModalDirective;

  channelObj = new Channel();
  mealObj = new Meal();
  methodObj = new Method();

  showInput = false;
  methodList: any[];
  mealsList: any[];
  chanelList: any[];
  selected_method: any;
  checked: boolean;
  is_loading: boolean;
  clicked: boolean;
  selected_channel: any;
  selected_meal: any;
  selected_meal_name: any;
  selected_meal_price: any;
  selected_method_name: any;
  selected_channel_name: any;

  constructor(
    private settingServices:SettingsService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    public  http: Http,
  ) { }

  ngOnInit() {
    this.getMethodList();
    this.getMealsList();
    this.getChannelList();
    setTimeout(() => {
      this.showInput = true;
    }, 3000);
  }

  // ngAfterViewInit() {
  //   console.log("afterinit");
  //   setTimeout(() => {
  //     console.log(this.abc.nativeElement.innerText);
  //   }, 1000);
  // }
  currentPageLoad() {      
    this.ngOnInit();
    this.router.navigate(['/settings/settings']);
  }

  getChannelList(){
    this.is_loading =  true;
    this.settingServices.getChannel().then(
      res => {
        this.is_loading =  false;
        if (res['success']) {
          this.chanelList = res['data'];
          return this.chanelList;         
        }
      },
       err => { 
        this.is_loading =  false;       
        console.log(err);
      }
    );   
  }

  getMealsList(){
    this.is_loading =  true;
    this.settingServices.getMeal().then(
      res => {
        this.is_loading =  false;
        if (res['success']) {
          this.mealsList = res['data'];
          return this.mealsList;         
        }
      },
       err => {  
        this.is_loading =  false;      
        console.log(err);
      }
    );      
  } 
 
  getMethodList(){
    this.is_loading =  true;
    this.settingServices.getMethod().then(
      res => {
        this.is_loading =  false;
        if (res['success']) {
          this.methodList = res['data'];
          console.log(this.methodList)
          return this.methodList;         
        }
      },
       err => {  
        this.is_loading =  false;      
        console.log(err);
      }
    );      
  }

  toggleClickedChannel(each_channel){
    this.selected_channel = each_channel
    this.checked = true
    this.is_loading = true
    let data
    if (this.selected_channel.is_active) {
      data = {
        is_active: 0
      }
    } else {
      data = {
        is_active: 1
      }
    }
    this.settingServices.updateChannel(this.selected_channel.id, JSON.stringify(data)).then(
      res => {
        this.is_loading = false
        if (res['success']) {
          this.currentPageLoad();
          this.toastr.success('Successfully changed!');
          this.clicked = false
          this.checked = false
        } else {
          this.toastr.error('Oh Snap! Can not update activation at this moment please try again later');
          this.clicked = false
          this.checked = false
        }
      },
      err => {
        this.is_loading = false
        this.toastr.error('Oh Snap! Internal Server Error');
        this.clicked = false
        this.checked = false
      }
    );
  }

  toggleClickedMeal(each_meal){
    this.selected_meal = each_meal
    this.checked = true
    this.is_loading = true
    let data
    if (this.selected_meal.is_active) {
      data = {
        is_active: 0
      }
    } else {
      data = {
        is_active: 1
      }
    }
    this.settingServices.updateMeals(this.selected_meal.id, JSON.stringify(data)).then(
      res => {
        this.is_loading = false
        if (res['success']) {
          this.currentPageLoad();
          this.toastr.success('Successfully changed!');
          this.clicked = false
          this.checked = false
        } else {
          this.toastr.error('Oh Snap! Can not update activation at this moment please try again later');
          this.clicked = false
          this.checked = false
        }
      },
      err => {
        this.is_loading = false
        this.toastr.error('Oh Snap! Internal Server Error');
        this.clicked = false
        this.checked = false
      }
    );
  }

  toggleClicked(each_method){
    this.selected_method = each_method
    this.checked = true
    this.is_loading = true
    let data
    if (this.selected_method.is_active) {
      data = {
        is_active: 0
      }
    } else {
      data = {
        is_active: 1
      }
    }
    this.settingServices.updateMethod(this.selected_method.id, JSON.stringify(data)).then(
      res => {
        this.is_loading = false
        if (res['success']) {
          this.currentPageLoad();
          this.toastr.success('Successfully changed!');
          this.clicked = false
          this.checked = false
        } else {
          this.toastr.error('Oh Snap! Can not update activation at this moment please try again later');
          this.clicked = false
          this.checked = false
        }
      },
      err => {
        this.is_loading = false
        this.toastr.error('Oh Snap! Internal Server Error');
        this.clicked = false
        this.checked = false
      }
    );
  }

  onMethodSubmit(form : NgForm){
    this.is_loading = true
    var name = form.controls['methodName'].value;
    var activity = form.controls['methodStatus'].value;
    
    if(activity == null){
      activity = 0;
    }

    let model = {
      method :name,
      is_active :activity
    }

    this.settingServices.addPayment(model).then(
      res => {
        if (res['success']) {
          this.is_loading = false;
          form.resetForm();     
          this.addMethodModal.hide();
          this.toastr.success('Successfully Added!');
          this.currentPageLoad();
        } else {
          this.is_loading = false;
          this.toastr.error('Oops! Can not add activity at this moment please try again later');
          this.clicked = false;
        }
      },
      err => {
        this.is_loading = false
        this.toastr.error('Oops! Internal Server Error');
        this.clicked = false
      }
    );
  }

  onMealSubmit(form : NgForm){
    this.is_loading = true
    var name = form.controls['mealName'].value;
    var price = form.controls['mealPrice'].value;
    var activity = form.controls['mealStatus'].value;
    
    if(activity == null){
      activity = 0;
    }

    let model = {
      meal : name,
      price :price,
      is_active :activity
    }

    this.settingServices.addMeals(model).then(
      res => {
        if (res['success']) {
          this.is_loading = false;
          form.resetForm();     
          this.addMealModal.hide();
          this.toastr.success('Successfully Added!');
          this.currentPageLoad();
        } else {
          this.is_loading = false;
          this.toastr.error('Oops! Can not add activity at this moment please try again later');
          this.clicked = false;
        }
      },
      err => {
        this.is_loading = false
        this.toastr.error('Oops! Internal Server Error');
        this.clicked = false
      }
    );

  }

  onChannelSubmit(form : NgForm){
    this.is_loading = true
    var name = form.controls['channelName'].value;
    var activity = form.controls['channelStatus'].value;
    
    if(activity == null){
      activity = 0;
    }

    let model = {
      channel :name,
      is_active :activity
    }

    this.settingServices.addChannel(model).then(
      res => {
        if (res['success']) {
          this.is_loading = false;
          form.resetForm();     
          this.addChannelModal.hide();
          this.toastr.success('Successfully Added!');
          this.currentPageLoad();
        } else {
          this.is_loading = false;
          this.toastr.error('Oops! Can not add activity at this moment please try again later');
          this.clicked = false;
        }
      },
      err => {
        this.is_loading = false
        this.toastr.error('Oops! Internal Server Error');
        this.clicked = false
      }
    );

  }

  updateMethod(method){
    this.selected_method = method;
    this.selected_method_name = method.method;
    this.editMethodModal.show();
  }

  updateMeal(meal){
    this.selected_meal = meal;
    this.selected_meal_name = meal.meal;
    this.selected_meal_price = meal.price;
    this.editMealModal.show();
  }

  updateChannel(channel){
    this.selected_channel = channel;
    this.selected_channel_name = channel.channel;
    this.editChannelModal.show();
  }

  updateChannelObj(id){
    console.log(id);
    this.is_loading = true
    this.clicked = true
    let model = {
      "channel"        : this.selected_channel_name,
    }
      this.editChannelModal.hide();
      this.settingServices.updateChannel(id, model).then(
      res => {
        this.is_loading = false;

        if (res['success']) {
          this.toastr.success('Successfully Updated!');
          this.clicked = false
          this.currentPageLoad();
        } else {
          this.toastr.error('Oh Snap! Can not update item at this moment please try again later');
          this.clicked = false
        }
      },
      err => {
        this.is_loading = false
        this.toastr.error('Oh Snap! Internal Server Error');
        this.clicked = false
      }
    );
  }

  updateMethodObj(methodId){
      this.is_loading = true
      this.clicked = true
      let model = {
        "method"        : this.selected_method_name,
      }
    
      this.settingServices.updateMethod(methodId, model).then(
      res => {
        this.is_loading = false
        if (res['success']) {
          this.toastr.success('Successfully Updated!');
          this.editMethodModal.hide();
          this.clicked = false
          this.currentPageLoad();
        } else {
          this.toastr.error('Oh Snap! Can not update item at this moment please try again later');
          this.clicked = false
        }
      },
      err => {
        this.is_loading = false
        this.toastr.error('Oh Snap! Internal Server Error');
        this.clicked = false
      }
    );
  }

  updateMealObj(mealId){
    this.is_loading = true
    this.clicked = true
    let model = {
      "meal"        : this.selected_meal_name,
      "price"       : this.selected_meal_price
    }
  
      this.settingServices.updateMeals(mealId, model).then(
      res => {
        this.is_loading = false
        if (res['success']) {
          this.toastr.success('Successfully Updated!');
          this.clicked = false;
          this.editMealModal.hide();
          this.currentPageLoad();
        } else {
          this.toastr.error('Oh Snap! Can not update item at this moment please try again later');
          this.clicked = false
        }
      },
      err => {
        this.is_loading = false
        this.toastr.error('Oh Snap! Internal Server Error');
        this.clicked = false
      }
    );
  }

  deleteMethodValues(method){
    this.selected_method = method;
    this.deleteMethodModal.show();
  }

  deleteMealValues(meal){
    this.selected_meal = meal;
    this.deleteMealModal.show();
  }

  deleteChannelValues(chanel){
    this.selected_channel = chanel
    this.deleteChanelModal.show();
  }

  deleteMethod(id){
    this.is_loading = true
    this.deleteMethodModal.hide();
    this.settingServices.deleteMethod(id).then((res) => {
      if (res['success']) {
        this.is_loading = false
        this.toastr.success('Successfully Deleted!');
        this.currentPageLoad();
        this.clicked = false
      } else {
        this.is_loading = false
        this.toastr.error('Oh Snap! Can not delete item at this moment please try again later');
        this.clicked = false
      }
    },
      err => {
        this.is_loading = false
        this.toastr.error('Error!');
        console.log(err);
      });
  }

  deleteMeal(id){
    this.is_loading = true
    this.clicked = true
    this.deleteMealModal.hide();
    this.settingServices.deleteMeal(id).then((res) => {
      if (res['success']) {
        this.is_loading = false
        this.toastr.success('Successfully Deleted!');
        this.currentPageLoad();
        this.clicked = false
      } else {
        this.is_loading = false
        this.toastr.error('Oh Snap! Can not delete item at this moment please try again later');
        this.clicked = false
      }
    },
      err => {
        this.is_loading = false
        this.toastr.error('Error!');
        console.log(err);
      });
  }

  deleteChannel(id){
    console.log(id)
    this.is_loading = true
    this.clicked = true
    this.deleteChanelModal.hide();
    this.settingServices.deleteChannel(id).then((res) => {
      if (res['success']) {
        this.is_loading = false
        this.toastr.success('Successfully Deleted!');
        this.currentPageLoad();
        this.clicked = false
      } else {
        this.is_loading = false
        this.toastr.error('Oh Snap! Can not delete item at this moment please try again later');
        this.clicked = false
      }
    },
      err => {
        this.is_loading = false
        this.toastr.error('Error!');
        console.log(err);
      });
  }

  
}
