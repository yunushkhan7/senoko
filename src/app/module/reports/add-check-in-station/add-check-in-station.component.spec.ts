import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCheckInStationComponent } from './add-check-in-station.component';

describe('AddCheckInStationComponent', () => {
  let component: AddCheckInStationComponent;
  let fixture: ComponentFixture<AddCheckInStationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCheckInStationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCheckInStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
