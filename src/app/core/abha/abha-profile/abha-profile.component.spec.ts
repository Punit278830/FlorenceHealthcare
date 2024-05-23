import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbhaProfileComponent } from './abha-profile.component';


describe('ProfileComponent', () => {
  let component: AbhaProfileComponent;
  let fixture: ComponentFixture<AbhaProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AbhaProfileComponent]
    });
    fixture = TestBed.createComponent(AbhaProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
