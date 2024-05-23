import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentStatusModalComponent } from './enrollment-status-modal.component';

describe('EnrollmentStatusModalComponent', () => {
  let component: EnrollmentStatusModalComponent;
  let fixture: ComponentFixture<EnrollmentStatusModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnrollmentStatusModalComponent]
    });
    fixture = TestBed.createComponent(EnrollmentStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
