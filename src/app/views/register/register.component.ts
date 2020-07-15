import { Component, OnInit }  from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonServicesService } from '../../services/common-services.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../employee/employee.service';
import { MustMatch } from './helpers/must-match.validator';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit{
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  id;
  token;
  
  constructor(
    private formBuilder: FormBuilder,
    commonService: CommonServicesService,
    private router: Router,
    private httpClient: HttpClient,
    private toastr: ToastrService,
    private employeeService: EmployeeService,
    private route: ActivatedRoute
    ) { }

    ngOnInit() {
      this.registerForm = this.formBuilder.group({
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      }, {
        validator: MustMatch('password', 'confirmPassword')
      }); 
      this.id = this.route.snapshot.queryParamMap.get('id');
      this.token = this.route.snapshot.queryParamMap.get('token');
    }
    
    get f() { return this.registerForm.controls; }

    onSubmit() {
      this.submitted = true;
  
      if (this.registerForm.invalid) {
        // console.log(this.registerForm);
      } else {
  
        const registerUser = {
          password: this.registerForm.value.password,
          id: this.id,
          token: this.token
        };
        this.loading = true;
        this.employeeService.registerAdminUser(registerUser).then(
          res => {
            if (res['success']) {
              console.log(res);
              this.toastr.success("Successfully Registered!");
              this.registerForm.reset();
            }
          },
          err => {
            this.toastr.error(err.error);
            this.toastr.error("Error!");
            console.log(err);
          }
        );
      }
    }
  

}
