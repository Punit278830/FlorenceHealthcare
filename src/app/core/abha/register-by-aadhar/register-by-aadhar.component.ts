import { Component } from '@angular/core';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-register-by-aadhar',
  templateUrl: './register-by-aadhar.component.html',
  styleUrls: ['./register-by-aadhar.component.scss']
})
export class RegisterByAadharComponent {
  public routes = routes;
  
  public ngOnInit(){
    
  }
  
  
}
