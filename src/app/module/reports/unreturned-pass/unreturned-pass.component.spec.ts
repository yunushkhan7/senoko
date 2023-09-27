import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnreturnedPassComponent } from './unreturned-pass.component';

describe('UnreturnedPassComponent', () => {
  let component: UnreturnedPassComponent;
  let fixture: ComponentFixture<UnreturnedPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnreturnedPassComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnreturnedPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
