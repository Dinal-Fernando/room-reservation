import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayNewComponent } from './day-new.component';

describe('DayNewComponent', () => {
  let component: DayNewComponent;
  let fixture: ComponentFixture<DayNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
