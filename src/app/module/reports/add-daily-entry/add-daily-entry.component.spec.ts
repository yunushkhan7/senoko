import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDailyEntryComponent } from './add-daily-entry.component';

describe('AddDailyEntryComponent', () => {
  let component: AddDailyEntryComponent;
  let fixture: ComponentFixture<AddDailyEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDailyEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDailyEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
