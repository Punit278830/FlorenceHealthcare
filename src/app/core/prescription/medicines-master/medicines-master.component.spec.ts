import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicinesMasterComponent } from './medicines-master.component';

describe('PrescriptionMasterComponent', () => {
  let component: MedicinesMasterComponent;
  let fixture: ComponentFixture<MedicinesMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedicinesMasterComponent]
    });
    fixture = TestBed.createComponent(MedicinesMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
