import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcsServerListComponent } from './acs-server-list.component';

describe('AcsServerListComponent', () => {
  let component: AcsServerListComponent;
  let fixture: ComponentFixture<AcsServerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcsServerListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcsServerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
