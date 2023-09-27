import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryVisitorComponent } from './entry-visitor.component';

describe('EntryVisitorComponent', () => {
  let component: EntryVisitorComponent;
  let fixture: ComponentFixture<EntryVisitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntryVisitorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntryVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
