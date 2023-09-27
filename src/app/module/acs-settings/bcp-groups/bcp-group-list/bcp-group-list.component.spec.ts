import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcpGroupListComponent } from './bcp-group-list.component';

describe('BcpGroupListComponent', () => {
  let component: BcpGroupListComponent;
  let fixture: ComponentFixture<BcpGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcpGroupListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BcpGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
