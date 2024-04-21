import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceDetailsComponent } from './advance-details.component';

describe('AdvanceDetailsComponent', () => {
  let component: AdvanceDetailsComponent;
  let fixture: ComponentFixture<AdvanceDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdvanceDetailsComponent]
    });
    fixture = TestBed.createComponent(AdvanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
