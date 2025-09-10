import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DepartmentService } from 'src/app/shared/Services/department/department.service';
import { Idepartment } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-edit-department',
  templateUrl: './edit-department.component.html',
  styleUrls: ['./edit-department.component.scss']
})
export class EditDepartmentComponent {
  public routes = routes;
  public depForm!:FormGroup;
  private depDto!:Idepartment
  private depId!:number;
   public depStatus=[
{value:'Active'},
{value:'Inactive'}
  ]

  constructor(private fb:FormBuilder,
    private departmentService:DepartmentService,
    private toster:ToastrService,
    private route:Router)
  {
    if(this.departmentService.departmentId)
    {
    this.depId=this.departmentService.departmentId;
    }

    else{
      this.route.navigate([routes.departmentList]);
    }
  }

  ngOnInit()
  {
    this.initlizeDepartmentForm()
    this.setData()
  }
  setData(){
    this.departmentService.getDepartmentByID(this.departmentService.departmentId).subscribe(data=>{

      this.depForm.patchValue(data);
    })
  }



  initlizeDepartmentForm()
  {
    this.depForm=this.fb.group({
      departmentName:['',Validators.required],
      displayName:[''],
      departmentStatus:['',Validators.required]
    })

  }

  editDepartment(dep:FormGroup)
  {
    if (this.depForm.valid) {
      this.depDto=dep.value;
      this.depDto.departmentId=this.depId;

      this.departmentService.updateDepartment(this.depId,this.depDto).subscribe(
        res=>{

        res?this.toster.success("Department updated successfully"):null
        this.route.navigate([routes.departmentList])
        
      },
       error => {
        this.toster.error(error.statusText,'Error')
          
        });
    } else {
      this.depForm.markAllAsTouched()
    }
  }
cancleUpdate()
{

}
  
}
