import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterByAadharStepperComponent } from './register-by-aadhar-stepper.component';

describe('RegisterByAadharStepperComponent', () => {
  let component: RegisterByAadharStepperComponent;
  let fixture: ComponentFixture<RegisterByAadharStepperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterByAadharStepperComponent]
    });
    fixture = TestBed.createComponent(RegisterByAadharStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
