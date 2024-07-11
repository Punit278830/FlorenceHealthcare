import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbhaScanDeskComponent } from './abha-scan-desk.component';

describe('AbhaScanDeskComponent', () => {
  let component: AbhaScanDeskComponent;
  let fixture: ComponentFixture<AbhaScanDeskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AbhaScanDeskComponent]
    });
    fixture = TestBed.createComponent(AbhaScanDeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
