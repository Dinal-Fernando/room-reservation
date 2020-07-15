import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, NgForm, NgModel } from '@angular/forms';
import { Category } from '../category/category';
import { CategoryService} from '../category/category.service' ;
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { RoomsService } from './rooms.service';
import { Router, ActivatedRoute } from '@angular/router';
import { __param } from 'tslib';
import { data } from 'jquery';
import { ToastrModule } from 'ngx-toastr';
import { Room } from './room';

@Component({
  selector: 'app-add-spacce',
  templateUrl: './add-spacce.component.html',
  styleUrls: ['./add-spacce.component.css'],
})

export class AddSpacceComponent implements OnInit {
  @ViewChild('activeModal') public activeModal: ModalDirective;
  @ViewChild('editServiceModal') public editServiceModal: ModalDirective;
  @ViewChild('deleteServiceModal') public deleteServiceModal: ModalDirective;
  @ViewChild('addRoomModal') public addRoomModal: ModalDirective;
 
  p: number = 1;
  pageSize: number = 10
  total: number = 100;

  categories: Category[];
  categoryList: any[]=[]

  roomList :any[];

  is_active="true";

  is_loading = false
  is_page_loading = false
  is_all = false

  room = new Room();

  selected_room: any;
  selected_room_name: any;
  selected_room_number: any;
  selected_room_price: any;
  selected_room_category: any;
  route_category_id=""
  category_id: any;
  categoriesList: any[]=[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public  http: Http,
    private categoryService :CategoryService,
    private toastr: ToastrService,
    private roomService: RoomsService) { }
                                           
  ngOnInit() {
    this.getCategoryList();
    this.currentPageLoad();
  }
 
  currentPageLoad() {
    let page_no = 1
    let url_page = this.route.snapshot.params.page;

    if (url_page) {
      page_no = url_page
    }
    this.pageChanged(page_no);
  }

  pageChanged(newPage: any) {
    this.is_loading = true
    this.roomList = []
    this.p = newPage
    if(this.route_category_id) {
      this.router.navigate(['/add-space/add-spacce', { page: this.p, category: this.route_category_id }])
    } else {
      this.router.navigate(['/add-space/add-spacce', { page: this.p }])
    }
    this.getRoomList(this.p, this.pageSize);
    console.log(newPage)
  }

  getRoomList(page, limit) {
    this.roomService.getRooms(page, limit)
    .then(
      res => {
        this.is_loading = false
        if (res && res['success']) {
          console.log("Its a success");
          this.roomList= res['data'];
          console.log("Hello"+this.roomList);
          this.total = res['count'];
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

  navigateServiceChargers() {
    this.router.navigate(['/layout/service-chargers']);
  }

  onSubmit(form: NgForm){
    this.is_page_loading = true
    var room_number = form.controls['roomNumber'].value;
    var price = form.controls['roomPrice'].value;
    var is_active= form.controls['activity'].value == "true" ? 1 : 0;
    var category_id = form.controls['category'].value;
    let model = {
      room_number : room_number,
      price       : price,
      is_active   : is_active,
      category    : category_id
    }
    console.log("model"+model);
    this.roomService.addRooms(model).then(
      res => {
        this.is_page_loading = false
        if (res['success']) {
          this.toastr.success('Successfully Added!');
          form.resetForm();
          this.addRoomModal.hide();
          this.currentPageLoad();
        } else {
          this.toastr.error('Oops! Can not add category at this moment please try again later');
        }
      },
      err => {
        this.is_page_loading = false
        this.toastr.error('Oops! Internal Server Error');
      }
    );
  }

   getCategoryList() {
    this.categoryService.getCategoryByPage(1, 1000).then(
      res => {
        if (res['success']) {
          this.categoriesList = res['data'];
          for(var i = 0; i < this.categoriesList.length; i++) {
            if (this.categoriesList[i].is_active == true) {
              this.categoryList.push(this.categoriesList[i]);
            }
          }
         return this.categoryList;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  updateValues(event) {
    this.selected_room_number  = event.room_number;
    this.selected_room_price   = event.price;
    this.category_id           = event.category_id;
    console.log("id"+ event.category_id);
    this.selected_room = event
    this.editServiceModal.show();
  }

  updateRoomList() {
    this.is_page_loading = true
    let model = {
      "room_number" : this.selected_room_number,
      "price"       : this.selected_room_price,
      "category_id" : this.category_id
    }
    
   console.log("WEWEWEWE"+ this.category_id);
    this.roomService.updateRooms(this.selected_room.id, model).then(
      res => {
        this.is_page_loading = false
        if (res['success']) {
          this.toastr.success('Successfully Updated!');
          this.editServiceModal.hide();
          this.currentPageLoad();
        } else {
          this.toastr.error('Oh Snap! Can not update item at this moment please try again later');
        }
      },
      err => {
        this.is_page_loading = false
        this.toastr.error('Oh Snap! Internal Server Error');
      }
    );
  }
  
  deleteRoomList(){
    this.is_page_loading = true
      this.roomService.deleteRooms(this.selected_room.id).then((res) => {
        if (res['success']) {
          this.toastr.success('Successfully Deleted!');
          this.deleteServiceModal.hide();
          this.currentPageLoad() 
        } else {
          this.toastr.error('Oh Snap! Can not delete item at this moment please try again later');
        }
      },
        err => {
          this.toastr.error('Error!');
          console.log(err);
        });
  }

  deleteValues(event) {
    this.selected_room = event
    this.deleteServiceModal.show();
  }

  cancel() {
    this.activeModal.hide();
    this.currentPageLoad()
  }

  resetForm(form: NgForm){
    form.resetForm();
  }

  toggleClicked(room) {
    this.selected_room = room
    this.activeModal.show();
  }

  changeActivation() {
    this.is_page_loading = true
    let data
    if (this.selected_room.is_active) {
      data = {
        is_active: 0
      }
    } else {
      data = {
        is_active: 1
      }
    }
    this.roomService.changeRoomActivation(this.selected_room.id, JSON.stringify(data)).then(
      res => {
        this.is_page_loading = false
        if (res['success']) {
          this.toastr.success('Successfully changed!');
          this.activeModal.hide();
          this.currentPageLoad()
        } else {
          this.toastr.error('Oh Snap! Can not update activation at this moment please try again later');
        }
      },
      err => {
        this.is_page_loading = false
        this.toastr.error('Oh Snap! Internal Server Error');
      }
    );
  }

}
