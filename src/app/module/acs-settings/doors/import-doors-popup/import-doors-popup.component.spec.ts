import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportDoorsPopupComponent } from './import-doors-popup.component';

describe('ImportDoorsPopupComponent', () => {
  let component: ImportDoorsPopupComponent;
  let fixture: ComponentFixture<ImportDoorsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportDoorsPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportDoorsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
