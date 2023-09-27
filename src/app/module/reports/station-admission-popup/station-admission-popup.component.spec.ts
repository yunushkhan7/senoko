import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationAdmissionPopupComponent } from './station-admission-popup.component';

describe('StationAdmissionPopupComponent', () => {
  let component: StationAdmissionPopupComponent;
  let fixture: ComponentFixture<StationAdmissionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationAdmissionPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StationAdmissionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
