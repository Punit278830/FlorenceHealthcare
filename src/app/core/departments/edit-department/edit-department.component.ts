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
  }



  initlizeDepartmentForm()
  {
    this.depForm=this.fb.group({
      departmentName:['',Validators.required],
      departmentStatus:['Active',Validators.required]
    })

  }

  editDepartment(dep:FormGroup)
  {
    
    this.depDto=dep.value;
    this.departmentService.updateDepartment(this.depId,this.depDto).subscribe(
      res=>{
      console.log(res);
      res?this.toster.success("Department updated successfully"):null
      
    },
     error => {
      this.toster.error(error.statusText,'Error')
        
      });
  }
cancleUpdate()
{
  console.log()
}
  
}
