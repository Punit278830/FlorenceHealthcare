import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionPadComponent } from './prescription-pad.component';

describe('PrescriptionPadComponent', () => {
  let component: PrescriptionPadComponent;
  let fixture: ComponentFixture<PrescriptionPadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrescriptionPadComponent]
    });
    fixture = TestBed.createComponent(PrescriptionPadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
