import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionMasterComponent } from './prescription-master.component';

describe('PrescriptionMasterComponent', () => {
  let component: PrescriptionMasterComponent;
  let fixture: ComponentFixture<PrescriptionMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrescriptionMasterComponent]
    });
    fixture = TestBed.createComponent(PrescriptionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
