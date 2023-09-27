import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMonthlyEntrComponent } from './add-monthly-entr.component';

describe('AddMonthlyEntrComponent', () => {
  let component: AddMonthlyEntrComponent;
  let fixture: ComponentFixture<AddMonthlyEntrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMonthlyEntrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMonthlyEntrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
