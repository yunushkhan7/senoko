import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RollCallGroupPopupComponent } from './roll-call-group-popup.component';

describe('RollCallGroupPopupComponent', () => {
  let component: RollCallGroupPopupComponent;
  let fixture: ComponentFixture<RollCallGroupPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RollCallGroupPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RollCallGroupPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
