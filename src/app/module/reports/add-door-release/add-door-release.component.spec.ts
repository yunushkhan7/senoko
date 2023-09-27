import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDoorReleaseComponent } from './add-door-release.component';

describe('AddDoorReleaseComponent', () => {
  let component: AddDoorReleaseComponent;
  let fixture: ComponentFixture<AddDoorReleaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDoorReleaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDoorReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
