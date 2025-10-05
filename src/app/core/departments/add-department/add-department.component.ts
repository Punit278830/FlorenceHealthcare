import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  private depDto!: Idepartment;
  public isSubmitting = false;
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
      departmentName: ['',Validators.required],
      displayName: [''],
      departmentStatus: ['Active', Validators.required]
    })

  }

  addDepartment(dep: FormGroup) {
    if (this.depForm.valid && !this.isSubmitting) {
      // Prevent double submission
      this.isSubmitting = true;
      this.depForm.disable();
      
      this.depDto = dep.value;
      console.log('Adding department:', this.depDto); // Debug log
      
      this.departmentService.createDepartment(this.depDto).subscribe(
        res => {
          console.log('Department creation response:', res); // Debug log
          
          if (res) {
            this.toster.success("Department Added successfully");
            this.resetForm();
          }
          
          // Reset submission state
          this.isSubmitting = false;
          this.depForm.enable();
        },
        error => {
          console.error('Error creating department:', error); // Debug log
          this.toster.error(error.statusText || 'Error creating department', 'Error');
          
          // Reset submission state on error
          this.isSubmitting = false;
          this.depForm.enable();
        });

    } else if (!this.depForm.valid) {
      this.depForm.markAllAsTouched();
    }
  }

  resetForm() {
    this.isSubmitting = false;
    this.depForm.reset({
      departmentStatus: 'Active'
    });
    this.depForm.enable();
  }
}
