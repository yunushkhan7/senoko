import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeGroupsAddComponent } from './badge-groups-add.component';

describe('BadgeGroupsAddComponent', () => {
  let component: BadgeGroupsAddComponent;
  let fixture: ComponentFixture<BadgeGroupsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BadgeGroupsAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BadgeGroupsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
