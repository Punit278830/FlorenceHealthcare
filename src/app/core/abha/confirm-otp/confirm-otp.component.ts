import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-confirm-otp',
  templateUrl: './confirm-otp.component.html',
  styleUrls: ['./confirm-otp.component.scss']
})
export class ConfirmOtpComponent {
  public routes = routes;
  message!: string;
  txnId!: string;

  constructor(private router: Router) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();

    if (navigation && navigation.extras && navigation.extras.state) {
      this.message = navigation.extras.state['message'];
      this.txnId = navigation.extras.state['txnId'];
    }
  }

}
