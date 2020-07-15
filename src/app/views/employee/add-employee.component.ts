import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { EmployeeService } from './employee.service';
import { Employee } from '../employee/employee'
import { FormBuilder, NgForm, NgModel } from '@angular/forms';
import { UserType } from './userType';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { __param } from 'tslib';
import { data } from 'jquery';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
})

export class AddEmployeeComponent implements OnInit {
  @ViewChild('employeForm') public employeForm: ModalDirective;
  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  @ViewChild('editServiceModal') public editServiceModal: ModalDirective;
  @ViewChild('activeModal') public activeModal: ModalDirective;

  private is_active: number;
  employee =new Employee();
  httpC: HttpClient;
  
  p: number = 1;
  pageSize: number = 10
  total: number = 0;

  userType = new UserType();
  userTypeList :any[];
  
  //user = new Employee();
  userList:any[];

  is_loading = false
  is_page_loading = false
  selected_user_name: any;
  selected_user: any;
  password: any;
  token: any;
  selected_user_id: any;
  selected_first_name: any;
  selescted_last_name: any;
  selected_user_email: any;
  selected_user_type: any;
 
  constructor(
    public  http: Http,
    private router: Router,
    private toastr: ToastrService,
    private employeeService: EmployeeService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.getUserTypeList();
    this.currentPageLoad();
  }

  currentPageLoad(){
    let page_no = 1;
    let url_page =this.route.snapshot.params.page;
    if(url_page){
      page_no = url_page
    }
    this.pageChanged(page_no);
  }

  pageChanged(newPage: any) {
    this.is_loading = true
    this.userList =[]  
    this.p = newPage
    this.router.navigate(['/employee/add-employee', { page: this.p }])
    this.getUserList(this.p, this.pageSize);
    console.log(newPage);
  }

  getUserList(page, limit) {
    this.employeeService.getAllUser(page, limit)
    .then(
      res => {
        this.is_loading = false
        if (res && res['success']) {
          console.log("Its a success");
          this.userList= res['data'];
          console.log("Hello"+this.userList);
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

  onSubmit(form: NgForm){
    //this.isValidFormSubmitted = true;
    var name = form.controls['username'].value;
    var first_name= form.controls['first_name'].value; 
    var last_name= form.controls['last_name'].value;
    var email = form.controls['email'].value;
    var type= form.controls['role'].value;
    console.log("On submit values"+ name + first_name );
    let model = {
     username :name,
     first_name:first_name,
     last_name:last_name,
     email:email,
     type:type
    }
    console.log(type);
    this.employeeService.addUser(model).then(
      res => {
        this.is_page_loading = false
        if (res['success']) {
          this.toastr.success('Thankyou for registering with us! We have sent an email to activate account!');
          form.resetForm();
          this.primaryModal.hide();
          this.currentPageLoad();
        } else {
          this.toastr.error('Oops! Cannot add category at this moment please try again later');
          this.currentPageLoad();
        }
      },
      err => {
        this.is_page_loading = false
        this.toastr.error('Oops! Internal Server Error');
      }
    );
  }

   getUserTypeList(){
    this.employeeService.getUserTypeA().then(
      res => {
        if (res['success']) {
          this.userTypeList = res['data'];
        }
      },
      err => {
        console.log(err);
      }
    )
   }

   updateUserList() {
    this.is_page_loading = true
    let model = {
      "id"        : this.selected_user_id,
    //"username"  : this.selected_user_name,
      "first_name": this.selected_first_name,
      "last_name" : this.selescted_last_name,
      "email"     : this.selected_user_email,
      "type_id"   : this.selected_user_type,
    //"password"  : this.password,
    //"token"    : this.token      
    } 

    this.employeeService.updateUser( model).then(
      res => {
        this.is_page_loading = false
        if (res['success']) {
          this.toastr.success('Successfully Updated!');
          this.editServiceModal.hide();
          this.currentPageLoad() 
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

  updateValues(event) {
    this.selected_user_id = event.id
    this.selected_user_name=event.username
    this.selected_first_name=event.first_name
    this.selescted_last_name= event.last_name
    this.selected_user_email= event.email
    this.selected_user_type = event.type.value
    console.log(this.selected_user_type );
    this.selected_user = event
    this.editServiceModal.show();
  }
  
  toggleClicked(user) {
    this.selected_user = user
    this.activeModal.show();
  }

  changeActivation() {
    this.is_page_loading = true
    let data
    if (this.selected_user.is_active) {
      data = {
        id :this.selected_user.id,
        is_active: 0
      }
    } else {
      data = {
        id :this.selected_user.id,
        is_active: 1
      }
    }
    this.employeeService.changeUserActivation(data).then(
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
  // deleteCategoryList(){
  //   this.is_page_loading = true
  //     this.employeeService.(this.selected_category.id).then((res) => {
  //       if (res['success']) {
  //         this.toastr.success('Successfully Deleted!');
  //         this.deleteServiceModal.hide();
  //         this.currentPageLoad() 
  //       } else {
  //         this.toastr.error('Oh Snap! Can not delete item at this moment please try again later');
  //       }
  //     },
  //       err => {
  //         this.toastr.error('Error!');
  //         console.log(err);
  //       });
  // }

  // deleteValues(event) {
  //   this.selected_use = event
  //   this.deleteServiceModal.show();
  // }

  cancel() {
    this.activeModal.hide();
    this.currentPageLoad()
  }
  



}
