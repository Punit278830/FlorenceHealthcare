import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAbhaUserComponent } from './search-abha-user.component';

describe('SearchAbhaUserComponent', () => {
  let component: SearchAbhaUserComponent;
  let fixture: ComponentFixture<SearchAbhaUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchAbhaUserComponent]
    });
    fixture = TestBed.createComponent(SearchAbhaUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
