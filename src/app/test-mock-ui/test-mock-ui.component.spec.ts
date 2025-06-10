import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestMockUiComponent } from './test-mock-ui.component';

describe('TestMockUiComponent', () => {
  let component: TestMockUiComponent;
  let fixture: ComponentFixture<TestMockUiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestMockUiComponent]
    });
    fixture = TestBed.createComponent(TestMockUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
