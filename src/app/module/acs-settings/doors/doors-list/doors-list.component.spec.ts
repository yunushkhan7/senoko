import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoorsListComponent } from './doors-list.component';

describe('DoorsListComponent', () => {
  let component: DoorsListComponent;
  let fixture: ComponentFixture<DoorsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoorsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
