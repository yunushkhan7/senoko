import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeGroupsPopupComponent } from './badge-groups-popup.component';

describe('BadgeGroupsPopupComponent', () => {
  let component: BadgeGroupsPopupComponent;
  let fixture: ComponentFixture<BadgeGroupsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BadgeGroupsPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BadgeGroupsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
