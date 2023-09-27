import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcsServerAddComponent } from './acs-server-add.component';

describe('AcsServerAddComponent', () => {
  let component: AcsServerAddComponent;
  let fixture: ComponentFixture<AcsServerAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcsServerAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcsServerAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
