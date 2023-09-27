import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeGroupsListComponent } from './badge-groups-list.component';

describe('BadgeGroupsListComponent', () => {
  let component: BadgeGroupsListComponent;
  let fixture: ComponentFixture<BadgeGroupsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BadgeGroupsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BadgeGroupsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
