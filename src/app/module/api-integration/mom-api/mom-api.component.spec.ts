import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MomApiComponent } from './mom-api.component';

describe('MomApiComponent', () => {
  let component: MomApiComponent;
  let fixture: ComponentFixture<MomApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MomApiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MomApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
