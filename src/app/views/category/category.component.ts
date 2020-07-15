import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { CategoryService} from './category.service';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, NgForm, NgModel } from '@angular/forms';
import { Category} from '../category/category';
import { ToastrService } from 'ngx-toastr';
import { ToastrModule } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { __param } from 'tslib';
import { data } from 'jquery';

declare var $: any;
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  providers: [CategoryService]
})

export class CategoryComponent implements OnInit {
  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  @ViewChild('activeModal') public activeModal: ModalDirective;
  @ViewChild('editServiceModal') public editServiceModal: ModalDirective;
  @ViewChild('deleteServiceModal') public deleteServiceModal: ModalDirective;
  httpC: HttpClient;

  p: number = 1;
  pageSize: number = 10
  total: number = 0;

  categoryList: any[];
  category =new Category();
  
  is_loading = false
  is_page_loading = false
 
  selected_category
  selected_category_name: any;

  categoryForm: NgForm;

  is_active ="true";
  constructor (
    private router: Router,
    public http: Http,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private route: ActivatedRoute) { }
  
    ngOnInit() {
      this.currentPageLoad()
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
      this.categoryList = []
      this.p = newPage
      this.router.navigate(['/category/category', { page: this.p }])
      this.getCategoryList(this.p, this.pageSize);
      console.log(newPage)
    }

    getCategoryList(page, limit) {
      this.categoryService.getCategoryByPage(page, limit)
      .then(
        res => {
          this.is_loading = false
          if (res && res['success']) {
            console.log("Its a success");
            this.categoryList= res['data'];
            console.log("Hello"+this.categoryList);
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
      this.is_page_loading = true
      var name = form.controls['categoryName'].value;
      var is_active= form.controls['activity'].value == "true" ? 1 : 0;
      //console.log("On submit values"+ name +is_active );
        let model = {
          name :name,
          is_active:is_active
        }
      this.categoryService.addCategory(model).then(
        res => {
          this.is_page_loading = false
          if (res['success']) {
            this.toastr.success('Successfully Added!');
            form.resetForm();
            this.primaryModal.hide();
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

    toggleClicked(category) {
      this.selected_category = category
      this.activeModal.show();
    }

    changeActivation() {
      this.is_page_loading = true
      let data
      if (this.selected_category.is_active) {
        data = {
          is_active: 0
        }
      } else {
        data = {
          is_active: 1
        }
      }
      this.categoryService.changeCategoryActivation(this.selected_category.id, JSON.stringify(data)).then(
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

    updateCategoryList() {
      this.is_page_loading = true
      let model = {
        "name": this.selected_category_name
      } 
      this.categoryService.updateCategory(this.selected_category.id, model).then(
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
      this.selected_category_name = event.category_name
      this.selected_category = event
      this.editServiceModal.show();
    }

    deleteCategoryList(){
      this.is_page_loading = true
        this.categoryService.deleteCategory(this.selected_category.id).then((res) => {
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
      this.selected_category = event
      this.deleteServiceModal.show();
    }

    cancel() {
      this.activeModal.hide();
      this.currentPageLoad()
    }
    
    resetCategoryForm(form: NgForm) {
      form.resetForm();
    }

    navigateToService(category) {
      this.router.navigate(['/category/category', { page: 1, category: category}])
    }

    
  }
