import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccessGroupAddComponent } from './user-access-group-add.component';

describe('UserAccessGroupAddComponent', () => {
  let component: UserAccessGroupAddComponent;
  let fixture: ComponentFixture<UserAccessGroupAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAccessGroupAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAccessGroupAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
