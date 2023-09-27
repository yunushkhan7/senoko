import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccessLogComponent } from './add-access-log.component';

describe('AddAccessLogComponent', () => {
  let component: AddAccessLogComponent;
  let fixture: ComponentFixture<AddAccessLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAccessLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAccessLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
