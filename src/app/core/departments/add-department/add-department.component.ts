import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from 'ngx-editor';
import { DepartmentService } from 'src/app/shared/Services/department/department.service';
import { Idepartment } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';
import { ToastrService } from 'ngx-toastr';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.scss']
})
export class AddDepartmentComponent implements OnInit {
  public routes = routes;
  public depForm!: FormGroup;
  private depDto!: Idepartment
  public depStatus = [
    { value: 'Active' },
    { value: 'Inactive' }
  ]



  constructor(private fb: FormBuilder, private departmentService: DepartmentService, private toster: ToastrService) {

  }

  ngOnInit() {
    this.initlizeDepartmentForm()
  }



  initlizeDepartmentForm() {
    this.depForm = this.fb.group({
      departmentName: ['',[Validators.required]],
      departmentStatus: ['Active', Validators.required]
    })

  }

  addDepartment(dep: FormGroup) {
    if (dep.valid) {
      console.log("hello")
      this.depDto = dep.value;
      this.departmentService.createDepartment(this.depDto).subscribe(
        res => {
          console.log(res);
          res ? this.toster.success("Department Added successfully") : null
          this.resetForm();
        },
        error => {
          this.toster.error(error.statusText, 'Error')
          console.error('Error during post:', error);
        });

    } else {
      dep.markAllAsTouched()
    }


  }

  resetForm() {
    this.depForm.reset();
  }
}
