import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInStationComponent } from './check-in-station.component';

describe('CheckInStationComponent', () => {
  let component: CheckInStationComponent;
  let fixture: ComponentFixture<CheckInStationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckInStationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckInStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
