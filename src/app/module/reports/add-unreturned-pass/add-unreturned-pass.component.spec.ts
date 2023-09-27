import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUnreturnedPassComponent } from './add-unreturned-pass.component';

describe('AddUnreturnedPassComponent', () => {
  let component: AddUnreturnedPassComponent;
  let fixture: ComponentFixture<AddUnreturnedPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUnreturnedPassComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUnreturnedPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
