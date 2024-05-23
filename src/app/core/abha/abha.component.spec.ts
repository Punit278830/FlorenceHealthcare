import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbhaComponent } from './abha.component';

describe('AbhaComponent', () => {
  let component: AbhaComponent;
  let fixture: ComponentFixture<AbhaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AbhaComponent]
    });
    fixture = TestBed.createComponent(AbhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
