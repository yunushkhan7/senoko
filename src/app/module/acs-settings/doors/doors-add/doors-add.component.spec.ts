import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoorsAddComponent } from './doors-add.component';

describe('DoorsAddComponent', () => {
  let component: DoorsAddComponent;
  let fixture: ComponentFixture<DoorsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoorsAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoorsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
