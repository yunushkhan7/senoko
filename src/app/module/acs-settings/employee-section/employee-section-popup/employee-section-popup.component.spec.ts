import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSectionPopupComponent } from './employee-section-popup.component';

describe('EmployeeSectionPopupComponent', () => {
  let component: EmployeeSectionPopupComponent;
  let fixture: ComponentFixture<EmployeeSectionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeSectionPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeSectionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
