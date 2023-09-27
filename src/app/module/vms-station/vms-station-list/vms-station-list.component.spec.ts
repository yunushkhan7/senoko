import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VmsStationListComponent } from './vms-station-list.component';

describe('VmsStationListComponent', () => {
  let component: VmsStationListComponent;
  let fixture: ComponentFixture<VmsStationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VmsStationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VmsStationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
