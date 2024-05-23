import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAbhaAddressComponent } from './add-abha-address.component';

describe('AddAbhaAddressComponent', () => {
  let component: AddAbhaAddressComponent;
  let fixture: ComponentFixture<AddAbhaAddressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddAbhaAddressComponent]
    });
    fixture = TestBed.createComponent(AddAbhaAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
