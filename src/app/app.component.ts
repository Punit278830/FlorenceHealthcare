import { Component, OnInit } from '@angular/core';
import { HospitalInitService } from './shared/Services/hospital/hospital-init.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'preclinic-angular';

  constructor(private hospitalInitService: HospitalInitService) {}

  ngOnInit() {
    // Initialize hospital selection on app startup
    this.hospitalInitService.initializeHospital();
  }
}
