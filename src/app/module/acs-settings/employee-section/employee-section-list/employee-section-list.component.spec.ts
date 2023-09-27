import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSectionListComponent } from './employee-section-list.component';

describe('EmployeeSectionListComponent', () => {
  let component: EmployeeSectionListComponent;
  let fixture: ComponentFixture<EmployeeSectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeSectionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeSectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
