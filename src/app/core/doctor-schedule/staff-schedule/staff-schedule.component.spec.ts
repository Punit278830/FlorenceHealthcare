import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffScheduleComponent } from './staff-schedule.component';

describe('StaffScheduleComponent', () => {
  let component: StaffScheduleComponent;
  let fixture: ComponentFixture<StaffScheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StaffScheduleComponent]
    });
    fixture = TestBed.createComponent(StaffScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
