import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SsaIntegrationComponent } from './ssa-integration.component';

describe('SsaIntegrationComponent', () => {
  let component: SsaIntegrationComponent;
  let fixture: ComponentFixture<SsaIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SsaIntegrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SsaIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
