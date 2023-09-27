import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcpGroupPopupComponent } from './bcp-group-popup.component';

describe('BcpGroupPopupComponent', () => {
  let component: BcpGroupPopupComponent;
  let fixture: ComponentFixture<BcpGroupPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcpGroupPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BcpGroupPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
