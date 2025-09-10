import { Component } from '@angular/core';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-abha-dashboard',
  templateUrl: './abha-dashboard.component.html',
  styleUrls: ['./abha-dashboard.component.scss']
})
export class AbhaDashboardComponent {
  public routes = routes;
  public CurrentTime = 0;
  public greetingMsg = 'Good Morning';
  public userName = '';

  public ngOnInit() {
    this.getGreetingMsg();
    const data = JSON.parse(localStorage.getItem('data') || '')
    this.userName = data.fname + " " + data.lname;
  }

  public getGreetingMsg() {
    this.CurrentTime = new Date().getHours()

    if (this.CurrentTime > 0 && this.CurrentTime < 12) { this.greetingMsg = 'Good Morning' }

    if (this.CurrentTime >= 12 && this.CurrentTime < 17) { this.greetingMsg = 'Good AfterNoon' }

    if (this.CurrentTime >= 17 && this.CurrentTime < 20) { this.greetingMsg = 'Good Evening' }
    if (this.CurrentTime >= 20 && this.CurrentTime < 24) { this.greetingMsg = 'Good Evening' }

  }

  
}
