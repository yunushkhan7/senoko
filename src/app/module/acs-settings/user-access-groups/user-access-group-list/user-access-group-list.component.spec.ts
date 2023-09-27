import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccessGroupListComponent } from './user-access-group-list.component';

describe('UserAccessGroupListComponent', () => {
  let component: UserAccessGroupListComponent;
  let fixture: ComponentFixture<UserAccessGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAccessGroupListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAccessGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
