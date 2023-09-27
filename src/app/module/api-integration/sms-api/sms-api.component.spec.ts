import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsApiComponent } from './sms-api.component';

describe('SmsApiComponent', () => {
  let component: SmsApiComponent;
  let fixture: ComponentFixture<SmsApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmsApiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmsApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
