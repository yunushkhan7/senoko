import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VmsStationAddComponent } from './vms-station-add.component';

describe('VmsStationAddComponent', () => {
  let component: VmsStationAddComponent;
  let fixture: ComponentFixture<VmsStationAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VmsStationAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VmsStationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
