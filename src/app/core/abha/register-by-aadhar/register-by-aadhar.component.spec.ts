import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterByAadharComponent } from './register-by-aadhar.component';

describe('RegisterByAadharComponent', () => {
  let component: RegisterByAadharComponent;
  let fixture: ComponentFixture<RegisterByAadharComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterByAadharComponent]
    });
    fixture = TestBed.createComponent(RegisterByAadharComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
