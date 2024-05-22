import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbhaDashboardComponent } from './abha-dashboard.component';

describe('AbhaDashboardComponent', () => {
  let component: AbhaDashboardComponent;
  let fixture: ComponentFixture<AbhaDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AbhaDashboardComponent]
    });
    fixture = TestBed.createComponent(AbhaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
