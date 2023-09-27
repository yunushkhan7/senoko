import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RollCallGroupListComponent } from './roll-call-group-list.component';

describe('RollCallGroupListComponent', () => {
  let component: RollCallGroupListComponent;
  let fixture: ComponentFixture<RollCallGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RollCallGroupListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RollCallGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
