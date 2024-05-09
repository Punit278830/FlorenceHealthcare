import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterCopyComponent } from './register-copy.component';


describe('RegisterByAadharComponent', () => {
  let component: RegisterCopyComponent;
  let fixture: ComponentFixture<RegisterCopyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterCopyComponent]
    });
    fixture = TestBed.createComponent(RegisterCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
