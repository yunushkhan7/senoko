import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountListComponent } from './user-account-list.component';

describe('UserAccountListComponent', () => {
  let component: UserAccountListComponent;
  let fixture: ComponentFixture<UserAccountListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAccountListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAccountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
