import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRollCallComponent } from './add-roll-call.component';

describe('AddRollCallComponent', () => {
  let component: AddRollCallComponent;
  let fixture: ComponentFixture<AddRollCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRollCallComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRollCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
