import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoorReleaseComponent } from './door-release.component';

describe('DoorReleaseComponent', () => {
  let component: DoorReleaseComponent;
  let fixture: ComponentFixture<DoorReleaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoorReleaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoorReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
