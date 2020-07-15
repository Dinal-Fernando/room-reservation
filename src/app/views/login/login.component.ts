import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../employee/employee.service';
import { NgForm, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  
  serverErrorMessages: string;
  is_loading = false
 
  @ViewChild('email') inputEl: ElementRef;
  loginForm: any;

  constructor(
     private toastr: ToastrService,
     private fb: FormBuilder,
     private employeeService: EmployeeService,
     private router: Router) {}

    onSubmit(form:NgForm) {
    this.is_loading = true
    var username = form.controls['username'].value;
    var password = form.controls['password'].value;
    let model = {
      username: username,
      password: password
    }
    this.employeeService.verifyUser(model).then(res => {
      this.is_loading = false
      if (res['success']) {
        this.toastr.success("Login Successful")
        localStorage.setItem("onepay_rt", res['Refresh_Token']);
        localStorage.setItem("onepay_t", res['Access_Token']);
        //localStorage.setItem("onepay_user", JSON.stringify(res['type']));
        this.router.navigateByUrl('/bookings/day');

      } else {
        this.toastr.error("Invalid Authentication Credentials", "Oh Snap")
      }
    },
      err => {
        this.toastr.error("Internal Server error occurred.", "Oh Snap")
        this.serverErrorMessages = err.error.Error;
      }
    );

  }

}