import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbhaConfirmOtpComponent } from './abha-confirm-otp.component';


describe('RegisterByAadharComponent', () => {
  let component: AbhaConfirmOtpComponent;
  let fixture: ComponentFixture<AbhaConfirmOtpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AbhaConfirmOtpComponent]
    });
    fixture = TestBed.createComponent(AbhaConfirmOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
