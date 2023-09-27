import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcsServerPopupComponent } from './acs-server-popup.component';

describe('AcsServerPopupComponent', () => {
  let component: AcsServerPopupComponent;
  let fixture: ComponentFixture<AcsServerPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcsServerPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcsServerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
