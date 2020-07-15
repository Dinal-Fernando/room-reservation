import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSpacceComponent } from './add-spacce.component';

describe('AddSpacceComponent', () => {
  let component: AddSpacceComponent;
  let fixture: ComponentFixture<AddSpacceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSpacceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSpacceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
