import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoorListPopupComponent } from './door-list-popup.component';

describe('DoorListPopupComponent', () => {
  let component: DoorListPopupComponent;
  let fixture: ComponentFixture<DoorListPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoorListPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoorListPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
