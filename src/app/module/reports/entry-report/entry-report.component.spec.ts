import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryReportComponent } from './entry-report.component';

describe('EntryReportComponent', () => {
  let component: EntryReportComponent;
  let fixture: ComponentFixture<EntryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
