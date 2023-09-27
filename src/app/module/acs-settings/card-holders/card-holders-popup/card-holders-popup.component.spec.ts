import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardHoldersPopupComponent } from './card-holders-popup.component';

describe('CardHoldersPopupComponent', () => {
  let component: CardHoldersPopupComponent;
  let fixture: ComponentFixture<CardHoldersPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardHoldersPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardHoldersPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
